const db = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const Joi = require("joi").extend(require("@joi/date"));
const multer = require("multer");
const { DateTime } = require("luxon");
const pesanTiket = async (req, res) => {
  let token = req.header("x-api-key");
  if (token == undefined || token == "") {
    return res.status(401).send({ message: "API Key harus diisi" });
  }
  const marketplace = await db.Marketplace.findOne({
    where: {
      api_key: {
        [Op.eq]: token,
      },
    },
    attributes: ["username"],
  });
  if (!marketplace) {
    return res.status(401).send({ message: "API Key invalid" });
  }
  const historyID = (await db.History.max("id_history")) || "H000000";
  let intID = parseInt(historyID.toString().substring(1)) + 1;
  let newID = "H" + intID.toString().padStart(6, "0");
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/tiket/");
    },
    filename: function (req, file, cb) {
      cb(null, newID + ".jpg");
    },
  });
  const upload = multer({
    fileFilter: function (req, file, cb) {
      if (file.mimetype != "image/jpg" && file.mimetype != "image/jpeg") {
        return cb(new Error("Format file salah"), null);
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
      return res
        .status(400)
        .send({ message: "Masukkan bukti pembayaran berupa foto" });
    }
    const { id_jadwal, nomor_kursi } = req.body;
    if (
      id_jadwal == undefined ||
      id_jadwal == "" ||
      nomor_kursi == "" ||
      nomor_kursi == undefined
    ) {
      fs.unlinkSync("uploads/tiket/" + newID + ".jpg");
      return res
        .status(400)
        .send({ message: "ID Jadwal dan nomor kursi harus diisi" });
    }
    const find_jadwal = await db.Jadwal.findOne({
      where: {
        id_jadwal: {
          [Op.eq]: id_jadwal,
        },
      },
    });
    if (find_jadwal) {
      let today = DateTime.now().setZone("Asia/Jakarta").toJSDate();
      let date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        today.getDate().toString().padStart(2, "0");
      let time =
        today.getHours().toString().padStart(2, "0") +
        ":" +
        today.getMinutes().toString().padStart(2, "0");
      let dateTime = date + " " + time;
      if (find_jadwal.jadwal_tayang < dateTime) {
        return res.status(400).send({
          message: "Jadwal sudah melewati tanggal pembelian",
        });
      }
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

      if (check_available_kursi) {
        if (check_available_kursi.status == 0) {
          const pembelian = await db.History.create({
            id_history: newID,
            id_marketplace: marketplace.username,
            id_tiket: check_available_kursi.id_tiket,
            id_jadwal: id_jadwal,
            nominal: find_jadwal.harga + 5000,
          });
          await db.Tiket.update(
            { status: 1 },
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
            "Pemesanan tiket dengan ID jadwal: " +
            id_jadwal +
            " untuk film " +
            find_jadwal.judul_film;
          +" dengan nomor kursi: " +
            nomor_kursi +
            " sedang diproses. Mohon akses endpoint 'get tiket' untuk informasi proses tiket";
          return res.status(201).send({
            message: pesan_berhasil,
            kode_tiket: check_available_kursi.id_tiket,
          });
        }
        fs.unlinkSync("uploads/tiket/" + newID + ".jpg");
        return res.status(400).send({ message: "Kursi sudah dibeli" });
      }
      fs.unlinkSync("uploads/tiket/" + newID + ".jpg");
      return res.status(404).send({ message: "Kursi tidak ditemukan" });
    }
    fs.unlinkSync("uploads/tiket/" + newID + ".jpg");
    return res.status(404).send({ message: "Jadwal tidak ditemukan" });
  });
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
  let result = [];
  let { id_bioskop } = req.params;

  if (token != undefined) {
    const search_user_api = await db.Marketplace.findOne({
      where: {
        api_key: {
          [Op.eq]: token,
        },
      },
    });

    if (!search_user_api) {
      return res.status(401).send({ message: "API Key Invalid" });
    }
    const cabang = await db.Cabang.findAll({ where: { id_bioskop } });
    if (cabang.length == 0) {
      return res.status(404).send({ message: "Bioskop belum memiliki cabang" });
    }
    for (let i = 0; i < cabang.length; i++) {
      const element = cabang[i];
      const studio = await element.getStudios({
        attributes: ["nomor_studio", "jenis_studio", "baris", "kolom"],
      });
      result.push({
        id_cabang: element.id_cabang,
        nama_cabang: element.nama,
        alamat_cabang: element.alamat,
        studio,
      });
    }
    return res.status(200).send(result);
  }

  return res.status(401).send({
    message: "API Key harus diisi",
  });
};

const showJadwal = async (req, res) => {
  let token = req.header("x-api-key");
  if (token == undefined || token == "") {
    return res.status(401).send({ message: "API Key harus diisi" });
  }
  const marketplace = await db.Marketplace.findOne({
    where: {
      api_key: {
        [Op.eq]: token,
      },
    },
    attributes: ["username"],
  });
  if (!marketplace) {
    return res.status(401).send({ message: "API Key invalid" });
  }
  let { id_cabang } = req.params;
  let today = DateTime.now().setZone("Asia/Jakarta").toJSDate();
  let date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    today.getDate().toString().padStart(2, "0");
  let time =
    today.getHours().toString().padStart(2, "0") +
    ":" +
    today.getMinutes().toString().padStart(2, "0");
  let dateTime = date + " " + time;
  let result = [];
  if (id_cabang == undefined || id_cabang == "") {
    return res.status(400).send({ message: "ID Cabang harus diisi" });
  }
  const cabang = await db.Cabang.findByPk(id_cabang);
  if (!cabang) {
    return res.status(404).send({ message: "Cabang tidak terdaftar" });
  }
  let studios = await cabang.getStudios();
  if (studios.length == 0) {
    return res.status(404).send({ message: "Cabang tidak memiliki studio" });
  }
  for (let i = 0; i < studios.length; i++) {
    const element = studios[i];
    let jadwals = await element.getJadwals({
      where: { jadwal_tayang: { [Op.gt]: dateTime } },
    });
    if (jadwals.length == 0) {
      continue;
    }
    for (let j = 0; j < jadwals.length; j++) {
      const e = jadwals[j];
      const kursi_tersedia = await db.Tiket.count({
        where: { id_jadwal: e.id_jadwal, status: 0 },
      });
      result.push({
        id_jadwal: e.id_jadwal,
        judul_film: e.judul_film,
        nama_cabang: cabang.nama,
        alamat: cabang.alamat,
        jam_tayang: e.jadwal_tayang,
        studio: element.nomor_studio,
        jenis_studio: element.jenis_studio,
        harga: e.harga + 5000,
        kursi_tersedia,
      });
    }
  }
  if (result.length == 0) {
    return res
      .status(404)
      .send({ message: "Tidak ada jadwal yang tersedia pada cabang ini" });
  }
  return res.status(200).send(result);
};

const search_jadwal_by_movie = async function (req, res) {
  let token = req.header("x-api-key");
  if (token == undefined || token == "") {
    return res.status(401).send({ message: "API Key harus diisi" });
  }
  const marketplace = await db.Marketplace.findOne({
    where: {
      api_key: {
        [Op.eq]: token,
      },
    },
    attributes: ["username"],
  });
  if (!marketplace) {
    return res.status(401).send({ message: "API Key invalid" });
  }
  const { id_film } = req.params;
  let today = DateTime.now().setZone("Asia/Jakarta").toJSDate();
  let date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    today.getDate().toString().padStart(2, "0");
  let time =
    today.getHours().toString().padStart(2, "0") +
    ":" +
    today.getMinutes().toString().padStart(2, "0");
  let dateTime = date + " " + time;
  const result = [];
  if (id_film == "" || id_film == undefined) {
    return res.status(400).send({ message: "Movie ID harus diisi" });
  }
  const jadwal = await db.Jadwal.findAll({
    where: { id_film, jadwal_tayang: { [Op.gt]: dateTime } },
  });
  if (jadwal.length == 0) {
    return res
      .status(404)
      .send({ message: "Film tidak tayang di bioskop manapun" });
  }
  for (let i = 0; i < jadwal.length; i++) {
    const element = jadwal[i];
    const studio = await element.getStudio();
    const cabang = await studio.getCabang();
    const kursi_tersedia = await db.Tiket.count({
      where: { id_jadwal: element.id_jadwal, status: 0 },
    });
    result.push({
      id_jadwal: element.id_jadwal,
      judul_film: element.judul_film,
      nama_cabang: cabang.nama,
      alamat: cabang.alamat,
      jam_tayang: element.jadwal_tayang,
      studio: studio.nomor_studio,
      jenis_studio: studio.jenis_studio,
      harga: element.harga + 5000,
      kursi_tersedia,
    });
  }
  return res.status(200).send(result);
};

const showKursi = async (req, res) => {
  let token = req.header("x-api-key");
  if (token == undefined || token == "") {
    return res.status(401).send({ message: "API Key harus diisi" });
  }
  let today = DateTime.now().setZone("Asia/Jakarta").toJSDate();
  let date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    today.getDate().toString().padStart(2, "0");
  let time =
    today.getHours().toString().padStart(2, "0") +
    ":" +
    today.getMinutes().toString().padStart(2, "0");
  let dateTime = date + " " + time;
  const marketplace = await db.Marketplace.findOne({
    where: {
      api_key: {
        [Op.eq]: token,
      },
    },
    attributes: ["username"],
  });
  if (!marketplace) {
    return res.status(401).send({ message: "API Key invalid" });
  }
  let { id_jadwal } = req.params;
  const search_jadwal = await db.Jadwal.findOne({
    where: {
      id_jadwal: {
        [Op.eq]: id_jadwal,
      },
    },
  });
  if (search_jadwal.jadwal_tayang < dateTime) {
    return res.status(400).send({
      message: "Jadwal sudah melewati tanggal pembelian",
    });
  }

  if (!search_jadwal) {
    return res.status(404).send({
      message: "Jadwal tidak ditemukan",
    });
  }

  const list_kursi = await db.Tiket.findAll({
    where: {
      id_jadwal: {
        [Op.eq]: id_jadwal,
      },
      status: 0,
    },
    attributes: ["nomor_kursi"],
  });

  const data = [];
  for (let i = 0; i < list_kursi.length; i++) {
    data.push(list_kursi[i].nomor_kursi);
  }
  return res.status(200).send({
    harga: search_jadwal.harga + 5000,
    kursi_tersedia: data,
  });
};
const showTiket = async function (req, res) {
  let token = req.header("x-api-key");
  if (token == undefined || token == "") {
    return res.status(401).send({ message: "API Key harus diisi" });
  }
  const marketplace = await db.Marketplace.findOne({
    where: {
      api_key: {
        [Op.eq]: token,
      },
    },
    attributes: ["username"],
  });
  if (!marketplace) {
    return res.status(401).send({ message: "API Key invalid" });
  }
  const history = await db.History.findAll({
    where: { id_marketplace: marketplace.username },
  });
  if (history.length == 0) {
    return res.status(404).send({ message: "Anda tidak memiliki tiket" });
  }
  let pending = [];
  let approved = [];
  let rejected = [];
  for (let i = 0; i < history.length; i++) {
    const element = history[i];
    const tiket = await db.Tiket.findByPk(element.id_tiket);
    const jadwal = await tiket.getJadwal();
    const studio = await jadwal.getStudio();
    const cabang = await studio.getCabang();
    if (element.status == 0) {
      pending.push({
        id_tiket: tiket.id_tiket,
        judul_film: jadwal.judul_film,
        lokasi: cabang.nama,
        studio: studio.nomor_studio,
        nomor_kursi: tiket.nomor_kursi,
        jam_tayang: jadwal.jadwal_tayang,
      });
    } else if (element.status == 1) {
      approved.push({
        id_tiket: tiket.id_tiket,
        judul_film: jadwal.judul_film,
        lokasi: cabang.nama,
        studio: studio.nomor_studio,
        nomor_kursi: tiket.nomor_kursi,
        jam_tayang: jadwal.jadwal_tayang,
        barcode_key: tiket.barcode_key,
      });
    } else if (element.status == 2) {
      rejected.push({
        id_tiket: tiket.id_tiket,
        judul_film: jadwal.judul_film,
        lokasi: cabang.nama,
        studio: studio.nomor_studio,
        nomor_kursi: tiket.nomor_kursi,
        jam_tayang: jadwal.jadwal_tayang,
      });
    }
  }
  return res.status(200).send({ approved, pending, rejected });
};
module.exports = {
  pesanTiket,
  queryBioskop,
  showCabang,
  showJadwal,
  showKursi,
  search_jadwal_by_movie,
  showTiket,
};
