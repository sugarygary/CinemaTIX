const db = require("../models");
const { Op } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));

const pesanTiket = async (req, res) => {
  const { bukti_pembayaran, id_jadwal, nomor_kursi } = req.body;
  const token = req.header("x-api-key");

  const find_jadwal = await db.Jadwal.findOne({
    where: {
      id_jadwal: {
        [Op.eq]: id_jadwal,
      },
    },
  });

  if (find_jadwal) {
    const marketplace = await db.Marketplace.findOne({
      where: {
        api_key: {
          [Op.eq]: token,
        },
      },
      attributes: ["username"],
    });

    const check_available_kursi = await db.Tiket.findOne({
      where: {
        id_jadwal: {
          [Op.eq]: id_jadwal,
        },
        nomor_kursi: {
          [Op.eq]: nomor_kursi,
        },
      },
    });

    if (check_available_kursi && marketplace) {
      console.log(check_available_kursi);
      if (check_available_kursi.status == 0) {
        const pembelian = await db.History.create({
          id_marketplace: marketplace.username,
          id_tiket: check_available_kursi.id_tiket,
          id_jadwal: id_jadwal,
        });

        if (pembelian) {
          const update_kursi = await db.Tiket.update(
            {
              status: 1,
            },
            {
              where: {
                id_jadwal: {
                  [Op.eq]: id_jadwal,
                },
                nomor_kursi: {
                  [Op.eq]: nomor_kursi,
                },
              },
            }
          );

          const pesan_berhasil =
            "Pemesanan tiket dengan ID jadwal:" +
            id_jadwal +
            " dan nomor kursi:" +
            nomor_kursi +
            " telah berhasil";
          return res.status(201).send({
            message: pesan_berhasil,
            kode_tiket: check_available_kursi.id_tiket,
          });
        }

        return res.status(400).send({ message: "Pembelian gagal!!" });
      }

      return res.status(400).send({ message: "Kursi sudah dibeli!!" });
    }

    return res.status(400).send({ message: "Pembelian gagal!!" });
  }
  return res.status(404).send({ message: "Jadwal tidak ditemukan!!" });
};

const queryBioskop = async (req, res) => {
  let token = req.header("x-api-key");
  let { nama_bioskop } = req.query;

  if (token != undefined) {
    const search_user_api = await db.Marketplace.findOne({
      where: {
        api_key: {
          [Op.eq]: token,
        },
      },
    });

    if (!search_user_api) {
      return res.status(400).send({ message: "Incorrect api key" });
    }
    let option = {
      attributes: ["id_bioskop", "nama"],
    };
    if (nama_bioskop) {
      option.where = { nama: { [Op.substring]: nama_bioskop } };
    }
    let queryResult = await db.Bioskop.findAll(option);
    if (queryResult.length == 0) {
      return res.status(404).send({ message: "Bioskop tidak ditemukan" });
    }
    let finalResult = [];
    for (let i = 0; i < queryResult.length; i++) {
      const element = queryResult[i];
      let cabang = await element.getCabangs({ attributes: ["nama", "alamat"] });
      finalResult.push({
        id_bioskop: element.id_bioskop,
        nama: element.nama,
        cabang,
      });
    }
    return res.status(200).send(finalResult);
  }

  return res.status(404).send({
    message: "Missing api key",
  });
};

const showCabang = async (req, res) => {
  let token = req.header("x-api-key");
  let { nama_bioskop } = req.query;

  if (token != undefined) {
    const search_user_api = await db.Marketplace.findOne({
      where: {
        api_key: {
          [Op.eq]: token,
        },
      },
    });

    if (!search_user_api) {
      return res.status(400).send({ message: "Incorrect api key" });
    }

    let search_bioskop;
    if (nama_bioskop && nama_bioskop.length > 1) {
      search_bioskop = await db.Bioskop.findAll({
        where: {
          nama: {
            [Op.like]: "%" + nama_bioskop + "%",
          },
        },
      });
    } else {
      search_bioskop = await db.Bioskop.findAll();
    }

    if (search_bioskop === null || search_bioskop.length === 0) {
      return res.status(404).send({
        message: "Bioskop tidak terdaftar!!",
      });
    }

    const temp = [];
    for (let i = 0; i < search_bioskop.length; i++) {
      const search_cabang = await db.Cabang.findAll({
        where: {
          id_bioskop: {
            [Op.eq]: search_bioskop[i].id_bioskop,
          },
        },
      });

      for (let j = 0; j < search_cabang.length; j++) {
        const data = {
          id_cabang: search_cabang[j].id_cabang,
          nama: search_cabang[j].nama,
        };

        temp.push(data);
      }
    }

    if (temp.length === 0) {
      return res.status(400).send({
        message: "Belum ada data bioskop",
      });
    }

    return res.status(200).send({
      data: temp,
    });
  }

  return res.status(404).send({
    message: "Missing api key",
  });
};

const showJadwal = async (req, res) => {
  let { id_cabang, id_movie } = req.query;

  if (id_cabang == undefined && id_movie == undefined) {
    return res.status(400).send({ message: "Input id cabang atau movie" });
  }

  if (
    id_cabang != undefined &&
    id_cabang.length > 0 &&
    (id_movie == undefined || id_movie.length === 0)
  ) {
    const search_cabang = await db.Cabang.findOne({
      where: {
        id_cabang: {
          [Op.eq]: id_cabang,
        },
      },
    });

    if (!search_cabang) {
      return res.status(404).send({ message: "Jadwal tidak ditemukan" });
    }

    const search_studio = await db.Studio.findAll({
      where: {
        id_cabang: {
          [Op.eq]: id_cabang,
        },
      },
    });

    const list_jadwal = [];

    for (let j = 0; j < search_studio.length; j++) {
      const search_jadwal = await db.Jadwal.findAll({
        where: {
          id_studio: {
            [Op.eq]: search_studio[j].id_studio,
          },
        },
      });

      for (let k = 0; k < search_jadwal.length; k++) {
        const data = {
          id_jadwal: search_jadwal[k].id_jadwal,
          id_studio: search_jadwal[k].id_studio,
          judul_film: search_jadwal[k].judul_film,
          jadwal_tayang: search_jadwal[k].jadwal_tayang,
          "durasi (menit)": search_jadwal[k].durasi,
          age_rating: search_jadwal[k].age_rating,
          harga: search_jadwal[k].harga,
          synopsis: search_jadwal[k].synopsis,
        };
        list_jadwal.push(data);
      }
    }

    return res.status(200).send({
      jadwal: list_jadwal,
    });
  } else if (
    id_movie != undefined &&
    id_movie.length > 0 &&
    (id_cabang == undefined || id_cabang.length === 0)
  ) {
    const search_jadwal = await db.Jadwal.findAll({
      where: {
        id_film: {
          [Op.eq]: id_movie,
        },
      },
    });

    if (!search_jadwal) {
      return res.status(404).send({ message: "Movie not found!!" });
    }

    const list_jadwal = [];

    for (let k = 0; k < search_jadwal.length; k++) {
      const data = {
        id_jadwal: search_jadwal[k].id_jadwal,
        id_studio: search_jadwal[k].id_studio,
        judul_film: search_jadwal[k].judul_film,
        jadwal_tayang: search_jadwal[k].jadwal_tayang,
        "durasi(menit)": search_jadwal[k].durasi,
        age_rating: search_jadwal[k].age_rating,
        harga: search_jadwal[k].harga,
        synopsis: search_jadwal[k].synopsis,
      };

      list_jadwal.push(data);
    }

    return res.status(200).send({
      jadwal: list_jadwal,
    });
  }

  return res.status(400).send({ message: "Input id cabang atau movie" });
};

const showKursi = async (req, res) => {
  let { id_jadwal } = req.params;

  const search_jadwal = await db.Jadwal.findOne({
    where: {
      id_jadwal: {
        [Op.eq]: id_jadwal,
      },
    },
  });

  if (!search_jadwal) {
    return res.status(404).send({
      message: "Jadwal tidak ditemukan!!",
    });
  }

  const list_kursi = await db.Tiket.findAll({
    where: {
      id_jadwal: {
        [Op.eq]: id_jadwal,
      },
    },
    attributes: ["nomor_kursi"],
  });

  const data = [];
  for (let i = 0; i < list_kursi.length; i++) {
    data.push(list_kursi[i].nomor_kursi);
  }

  return res.status(200).send({
    data: data,
  });
};

module.exports = {
  pesanTiket,
  queryBioskop,
  showCabang,
  showJadwal,
  showKursi,
};
