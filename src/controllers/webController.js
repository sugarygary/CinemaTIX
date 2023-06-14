const fs = require("fs");
const express = require("express");
const db = require("../models");
const { Op } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));
const multer = require("multer");
const path = require("path");

const queryBioskop = async (req, res) => {
  const validator = Joi.object({
    nama_bioskop: Joi.string(),
  });
  let token = req.header("x-api-key");
  const validationResult = await validator.validateAsync(req.body);

  if (token != undefined) {
    const webReview = await db.WebReview.findOne({
      where: {
        api_key: token,
      },
    });

    const cekBayar = await db.Subscription.findOne({
      where: {
        status: "Paid",
        bukti_pembayaran: webReview.username,
      },
    });

    if (cekBayar != null) {
      let tmp = cekBayar.tanggal_pembayaran;
      let bulan = tmp.substr(5, 2);
      let tanggal = tmp.substr(8, 2);
      let today = new Date();
      let month = today.getMonth() + 1;
      let date = today.getDate();
      if (
        (parseInt(month) == parseInt(bulan) &&
          parseInt(date) > parseInt(tanggal)) ||
        (parseInt(month) > parseInt(bulan) &&
          parseInt(date) <= parseInt(tanggal)) ||
        (parseInt(month) == parseInt(bulan) &&
          parseInt(date) == parseInt(tanggal))
      ) {
        if (webReview != null) {
          if (validationResult.nama_bioskop != null) {
            const idBioskop = await db.Bioskop.findOne({
              where: {
                nama: validationResult.nama_bioskop,
              },
            });

            if (idBioskop != null) {
              let cabang = await db.Cabang.findAll({
                where: {
                  id_bioskop: idBioskop.id_bioskop,
                },
              });
              return res.status(200).send({
                cabang,
              });
            } else {
              return res.status(404).send({
                message: "Bioskop tidak terdaftar",
              });
            }
          } else {
            let tmp;
            let bioskop = [];
            let allBioskop = await db.Bioskop.findAll();

            for (let i = 0; i < allBioskop.length; i++) {
              let cabang = await db.Cabang.findAll({
                where: {
                  id_bioskop: allBioskop[i].id_bioskop,
                },
              });
              let tmpBioskop = [];
              let tmpCabang;

              for (let j = 0; j < cabang.length; j++) {
                tmpCabang = {
                  id_cabang: cabang[j].id_cabang,
                  nama: cabang[j].nama,
                };
                tmpBioskop.push(tmpCabang);
              }
              tmp = {
                bioskop: allBioskop[i].nama,
                cabang: tmpBioskop,
              };
              bioskop.push(tmp);
            }
            return res.status(200).send({
              bioskop,
            });
          }
        } else {
          return res.status(400).send({
            message: "invalid api key",
          });
        }
      } else {
        return res.status(400).send({
          message: "anda belum melakukan pembayaran",
        });
      }
    } else {
      return res.status(400).send({
        message: "pembayaran anda belum disetujui",
      });
    }
  } else {
    return res.status(400).send({
      message: "api key required",
    });
  }
};

const showJadwal = async (req, res) => {
  const validator = Joi.object({
    movie_id: Joi.string().required(),
    id_bioskop: Joi.string(),
  });
  let token = req.header("x-api-key");
  const validationResult = await validator.validateAsync(req.params);

  const cekToken = await db.WebReview.findOne({
    where: {
      api_key: token,
    },
  });

  const cekBayar = await db.Subscription.findOne({
    where: {
      status: "Paid",
      bukti_pembayaran: cekToken.username,
    },
  });

  if (cekBayar != null) {
    // let tmp = cekBayar.valid_until;
    // let bulan = tmp.substr(5, 2);
    // let tanggal = tmp.substr(8, 2);
    // let today = new Date();
    // let month = today.getMonth() + 1;
    // let date = today.getDate();
    if (parseInt(month) == parseInt(bulan)) {
      if (token != undefined) {
        if (cekToken != null) {
          if (validationResult.id_bioskop != undefined) {
            let bioskop = await db.Bioskop.findOne({
              where: {
                id_bioskop: validationResult.id_bioskop,
              },
            });

            if (bioskop != null) {
              let jadwal = await db.Jadwal.findAll({
                where: {
                  id_film: validationResult.movie_id,
                },
              });

              let tmpCabang;
              let result = [];
              if (jadwal.length > 0) {
                for (let i = 0; i < jadwal.length; i++) {
                  let allStudio = await db.Studio.findAll({
                    where: {
                      id_bioskop: validationResult.id_bioskop,
                    },
                  });

                  for (let j = 0; j < allStudio.length; j++) {
                    if (jadwal[i].id_studio == allStudio[j].id_studio) {
                      let cabang = await db.Cabang.findAll({
                        where: {
                          id_cabang: allStudio[j].id_cabang,
                        },
                      });

                      for (let k = 0; k < cabang.length; k++) {
                        tmpCabang = {
                          nama: cabang[k].nama,
                          alamat: cabang[k].alamat,
                        };

                        result.push(tmpCabang);
                      }
                    }
                  }
                }

                if (result.length > 0) {
                  return res.status(200).send({
                    result,
                  });
                } else {
                  return res.status(404).send({
                    message: "Film tidak tayang pada bioskop ini",
                  });
                }
              } else {
                return res.status(404).send({
                  message: "Film tidak tayang pada bioskop ini",
                });
              }
            } else {
              return res.status(404).send({
                message: "bioskop tidak terdaftar",
              });
            }
          } else {
            let jadwal = await db.Jadwal.findAll({
              where: {
                id_film: validationResult.movie_id,
              },
            });

            let tmp;
            let tmpBioskop;
            let resultCabang = [];
            let result = [];

            for (let i = 0; i < jadwal.length; i++) {
              studio = await db.Studio.findAll({
                where: {
                  id_studio: jadwal[i].id_studio,
                },
              });

              for (let j = 0; j < studio.length; j++) {
                let cabang = await db.Cabang.findAll({
                  where: {
                    id_cabang: studio[j].id_cabang,
                  },
                });

                for (let k = 0; k < cabang.length; k++) {
                  tmp = {
                    nama: cabang[k].nama,
                    alamat: cabang[k].alamat,
                  };
                  result.push(tmp);
                }
              }
            }
            return res.status(404).send({
              result,
            });
          }
        } else {
          return res.status(400).send({
            message: "invalid api key",
          });
        }
      } else {
        return res.status(400).send({
          message: "api key required",
        });
      }
    } else {
      return res.status(400).send({
        message: "anda belum melakukan pembayaran",
      });
    }
  } else {
    return res.status(400).send({
      message: "pembayaran anda belum disetujui",
    });
  }
};

const pembayaran = async (req, res) => {
  const subID = (await db.Subscription.max("id_subscription")) || "SCB000";
  let intID = parseInt(subID.toString().substring(3)) + 1;
  let newID = "SCB" + intID.toString().padStart(3, "0");
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, newID + ".jpg");
    },
  });
  const upload = multer({
    fileFilter: function (req, file, cb) {
      if (file.mimetype != "image/jpg" && file.mimetype != "image/jpeg") {
        return cb(new Error("Wrong file type"), null);
      }
      cb(null, true);
    },
    storage: storage,
    limits: {
      fileSize: 100000000,
    },
  });
  const uploadFile = upload.single("bukti_pembayaran");
  uploadFile(req, res, async function (err) {
    if (err) {
      return res.status(400).send({ message: err });
    }
    if (!req.file) {
      fs.unlinkSync("uploads/" + newID + ".jpg");
      return res
        .status(400)
        .send({ message: "Masukkan bukti pembayaran berupa foto" });
    }
    let today = new Date();
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      today.getDate().toString().padStart(2, "0");
    let time =
      today.getHours().toString().padStart(2, "0") +
      ":" +
      today.getMinutes().toString().padStart(2, "0") +
      ":" +
      today.getSeconds().toString().padStart(2, "0");
    let dateTime = date + " " + time;
    let token = req.header("x-api-key");

    const webreview = await db.WebReview.findOne({
      where: {
        api_key: token,
      },
    });
    if (!webreview) {
      fs.unlinkSync("uploads/" + newID + ".jpg");
      return res.status(401).send({ message: "Invalid API Key" });
    }
    let lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);
    let lmdate =
      lastMonth.getFullYear() +
      "-" +
      (lastMonth.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      lastMonth.getDate().toString().padStart(2, "0");
    let lmtime =
      lastMonth.getHours().toString().padStart(2, "0") +
      ":" +
      lastMonth.getMinutes().toString().padStart(2, "0") +
      ":" +
      lastMonth.getSeconds().toString().padStart(2, "0");
    let lmdateTime = lmdate + " " + lmtime;
    const alreadySubscribed = await db.Subscription.findOne({
      where: {
        id_web_review: webreview.id_web_review,
        tanggal_pembayaran: { [Op.gt]: lmdateTime },
      },
    });
    if (alreadySubscribed) {
      fs.unlinkSync("uploads/" + newID + ".jpg");
      if (alreadySubscribed.status == "Pending") {
        return res
          .status(403)
          .send({ message: "Subscription anda sedang menunggu konfirmasi." });
      }
      return res
        .status(403)
        .send({ message: "Anda sudah berlangganan di CinemaTIX API." });
    }
    const pembayaran = await db.Subscription.create({
      id_subscription: newID,
      bukti_pembayaran: newID + ".jpg",
      tanggal_pembayaran: dateTime,
      status: "Pending",
      id_web_review: webreview.id_web_review,
    });
    return res
      .status(200)
      .send({ message: "Pembayaran anda akan kami proses." });
  });
};

const nowShowing = async (req, res) => {
  let token = req.header("x-api-key");
  let nowShowing = [];
  let temp;

  const cekToken = await db.WebReview.findOne({
    where: {
      api_key: token,
    },
  });

  const cekBayar = await db.Subscription.findOne({
    where: {
      status: "Paid",
      bukti_pembayaran: cekToken.username,
    },
  });

  if (cekBayar != null) {
    let tmp = cekBayar.tanggal_pembayaran;
    let bulan = tmp.substr(5, 2);
    let tanggal = tmp.substr(8, 2);
    let today = new Date();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    if (
      (parseInt(month) == parseInt(bulan) &&
        parseInt(date) > parseInt(tanggal)) ||
      (parseInt(month) > parseInt(bulan) &&
        parseInt(date) <= parseInt(tanggal)) ||
      (parseInt(month) == parseInt(bulan) &&
        parseInt(date) == parseInt(tanggal))
    ) {
      if (token != undefined) {
        if (cekToken != null) {
          let allFilm = await db.Jadwal.findAll();
          let jam = today.getHours();
          let menit = today.getMinutes();

          for (let i = 0; i < allFilm.length; i++) {
            let filmMulai = allFilm[i].jadwal_tayang;
            let bulan = filmMulai.substr(5, 2);
            let tanggal = filmMulai.substr(8, 2);
            let durasi = allFilm[i].durasi;
            let jamMulai = filmMulai.substr(11, 2);
            let menitMulai = filmMulai.substr(14, 2);
            let durasiJam = parseInt(durasi / 60);
            let durasiMenit = (durasi % 60) / 1;
            let jamSelesai = parseInt(jamMulai) + parseInt(durasiJam);
            let menitSelesai = parseInt(menitMulai) + parseInt(durasiMenit);
            jamSelesai = parseInt(jamSelesai) + parseInt(menitSelesai / 60);
            menitSelesai = menitSelesai % 60;

            if (
              (jam == jamSelesai && menit <= menitSelesai) ||
              (jam >= jamMulai && jam < jamSelesai)
            ) {
              if (month == bulan && date == tanggal) {
                let idCabang = allFilm[i].id_studio.substr(0, 5);
                const cabang = await db.Cabang.findOne({
                  where: {
                    id_cabang: idCabang,
                  },
                });
                temp = {
                  bioskop: cabang.nama,
                  film: allFilm[i].judul_film,
                  sinopsis: allFilm[i].synopsis,
                  durasi: allFilm[i].durasi,
                };

                nowShowing.push(temp);
              }
            }
          }
          return res.status(200).send({
            nowShowing,
          });
        } else {
          return res.status(401).send({
            message: "invalid api key",
          });
        }
      } else {
        return res.status(401).send({
          message: "api key required",
        });
      }
    } else {
      return res.status(403).send({
        message: "Masa subscription anda telah berakhir.",
      });
    }
  } else {
    return res.status(403).send({
      message: "pembayaran anda belum disetujui",
    });
  }
};

module.exports = {
  queryBioskop,
  showJadwal,
  pembayaran,
  nowShowing,
};
