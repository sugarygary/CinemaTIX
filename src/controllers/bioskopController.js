require("dotenv").config();
const { default: axios } = require("axios");
const db = require("../models");
const { Op } = require("sequelize");
const { DateTime } = require("luxon");
const Joi = require("joi").extend(require("@joi/date"));
const { IMDB_API_KEY } = process.env;

const checkValidId_Bioskop = async (id_bioskop) => {
  const b = await db.Bioskop.findOne({
    where: {
      id_bioskop: id_bioskop,
    },
  });
  if (b) {
    throw new Error("Bioskop invalid, Bioskop tidak terdaftar");
  } else {
    return id_bioskop;
  }
};

const checkValidId_Studio = async (id_studio) => {
  const c = await db.Studio.findOne({
    where: {
      id_studio: id_studio,
    },
  });
  if (c) {
    return id_studio;
  } else {
    throw new Error("id_studio invalid, studio tidak terdaftar");
  }
};

const checkValidId_Cabang = async (id_cabang) => {
  const c = await db.Cabang.findOne({
    where: {
      id_cabang: id_cabang,
    },
  });
  if (c) {
    return id_cabang;
  } else {
    throw new Error("Cabang tidak terdaftar");
  }
};

const validateBioskopAPIKey = async function (req, res, next) {
  let api_key = req.header("x-api-key");
  if (!api_key) {
    return res.status(401).send({ message: "API Key harus diisi" });
  }
  const u = await db.Bioskop.findOne({
    where: {
      api_key: api_key,
    },
  });
  if (!u) {
    return res.status(401).send({ message: "API Key invalid" });
  }
  req.user = u;
  next();
};

const deleteCabang = async function (req, res) {
  const { id_cabang } = req.params;
  const cabang = await db.Cabang.findByPk(id_cabang);
  if (cabang.id_bioskop != req.user.id_bioskop) {
    return res.status(403).send({ message: "Anda bukan pemilik cabang" });
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
  const studios = await cabang.getStudios();
  for (let i = 0; i < studios.length; i++) {
    const element = studios[i];
    const jadwals = await element.getJadwals({
      where: { jadwal_tayang: { [Op.gte]: dateTime } },
    });
    if (jadwals.length != 0) {
      return res.status(400).send({ message: "Cabang masih memiliki jadwal" });
    }
  }
  await cabang.destroy();
  return res.status(200).send({ message: "Cabang berhasil dihapus" });
};

const editTiket = async (req, res) => {
  const { id_jadwal, nomor_kursi } = req.body;
  if (
    id_jadwal == "" ||
    id_jadwal == undefined ||
    nomor_kursi == undefined ||
    nomor_kursi == ""
  ) {
    return res
      .status(400)
      .send({ message: "ID Jadwal dan Nomor Kursi harus diisi" });
  }
  const id_tiket = nomor_kursi + "" + id_jadwal;
  const tiket = await db.Tiket.findByPk(id_tiket);
  if (!tiket) {
    return res.status(404).send({ message: "Tiket tidak ditemukan" });
  }
  const cabang = await (
    await (await tiket.getJadwal()).getStudio()
  ).getCabang();
  if (cabang.id_bioskop != req.user.id_bioskop) {
    return res
      .status(403)
      .send({ message: "Tiket bukan merupakan tiket anda" });
  }
  if (tiket.status == 1) {
    if (tiket.barcode_key) {
      return res
        .status(403)
        .send({ message: "Hubungi pihak CinemaTIX untuk proses void tiket" });
    }
    return res.status(400).send({ message: "Tiket sudah pernah divoid" });
  }
  await tiket.update({ status: 1 });
  return res.status(200).send({ message: "Tiket berhasil divoid" });
};

const getCabang = async function (req, res) {
  const cabang = await req.user.getCabangs({
    attributes: { exclude: ["id_bioskop"] },
  });
  let result = [];
  for (let i = 0; i < cabang.length; i++) {
    const element = cabang[i];
    const studios = await element.getStudios({
      attributes: ["nomor_studio", "jenis_studio", "baris", "kolom"],
    });
    result.push({ ...element.dataValues, studio: studios });
  }
  return res.status(200).send(result);
};
const getSales = async function (req, res) {
  const result = [];
  let total_penghasilan = 0;
  const history = await db.History.findAll({ where: { status: 1 } });
  for (let i = 0; i < history.length; i++) {
    const element = history[i];
    const jadwal = await db.Jadwal.findByPk(element.id_jadwal);
    const studio = await jadwal.getStudio();
    const cabang = await studio.getCabang();
    const bioskop = await cabang.getBioskop();
    if (bioskop.id_bioskop != req.user.id_bioskop) {
      continue;
    }
    total_penghasilan += element.nominal - 5000;
    result.push({
      cabang: cabang.nama,
      tiket: element.id_tiket,
      film: jadwal.judul_film,
      marketplace: element.id_marketplace,
      pendapatan: element.nominal - 5000,
    });
  }
  return res.status(200).send({ total_penghasilan, sales_report: result });
};

const getJadwal = async function (req, res) {
  const { id_cabang } = req.params;
  const cabang = await db.Cabang.findByPk(id_cabang);
  if (!cabang) {
    return res.status(404).send({ message: "Cabang tidak terdaftar" });
  }
  if (cabang.id_bioskop != req.user.id_bioskop) {
    return res.status(403).send({ message: "Anda bukan pemilik cabang" });
  }
  let result = [];

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
    today.getMinutes().toString().padStart(2, "0") +
    ":" +
    today.getSeconds().toString().padStart(2, "0");
  let dateTime = date + " " + time;
  const studios = await cabang.getStudios({
    attributes: ["id_studio", "nomor_studio", "jenis_studio", "baris", "kolom"],
  });
  for (let i = 0; i < studios.length; i++) {
    const element = studios[i];
    const jadwals = await element.getJadwals({
      attributes: { exclude: ["id_studio"] },
      where: { jadwal_tayang: { [Op.gte]: dateTime } },
    });
    for (let j = 0; j < jadwals.length; j++) {
      const e = jadwals[j];
      result.push({
        studio: element.nomor_studio,
        jenis_studio: element.jenis_studio,
        ...e.dataValues,
      });
    }
  }

  return res.status(200).send(result);
};

const registerCabang = async (req, res) => {
  const validator = Joi.object({
    nama: Joi.string().required().label("Nama").messages({
      "any.required": "{{#label}} harus diisi",
      "string.empty": "{{#label}} tidak boleh blank",
    }),
    alamat: Joi.string().required().label("Alamat").messages({
      "any.required": "{{#label}} harus diisi",
      "string.empty": "{{#label}} tidak boleh blank",
    }),
  });
  try {
    const validationResult = await validator.validateAsync(req.body, {
      errors: {
        label: false,
        wrap: {
          label: false,
        },
      },
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
  const b = await db.Bioskop.findOne({
    where: {
      id_bioskop: req.user.id_bioskop,
    },
  });
  let ctr_cabang = (await db.Cabang.max("id_cabang")) || "CB000";
  let int_cabang = parseInt(ctr_cabang.substring(2)) + 1;
  let new_id = "CB" + int_cabang.toString().padStart(3, "0");
  await b.createCabang({
    id_cabang: new_id,
    alamat: req.body.alamat,
    nama: req.user.nama + " " + req.body.nama,
  });
  return res.status(201).send({
    message: "Cabang berhasil dibuat",
    id_cabang: new_id,
    nama: req.user.nama + " " + req.body.nama,
    alamat: req.body.alamat,
  });
};

const registerStudio = async (req, res) => {
  const validator = Joi.object({
    id_cabang: Joi.string()
      .external(checkValidId_Cabang)
      .required()
      .label("ID Cabang")
      .messages({
        "any.required": "{{#label}} harus ada",
        "string.empty": "{{#label}} tidak boleh blank",
      }),
    baris: Joi.number()
      .required()
      .label("Baris studio")
      .integer()
      .min(1)
      .max(26)
      .messages({
        "any.required": "{#label} harus diisi",
        "number.empty": "{{#label}} tidak boleh blank",
      }),
    kolom: Joi.number()
      .required()
      .label("Kolom studio")
      .integer()
      .min(1)
      .max(99)
      .messages({
        "any.required": "{{#label}} harus diisi",
        "number.empty": "{{#label}} tidak boleh blank",
      }),
    jenis_studio: Joi.string().required().label("Jenis studio").messages({
      "any.required": "{{#label}} harus diisi",
      "string.empty": "{{#label}} tidak boleh blank",
    }),
  });
  try {
    const validationResult = await validator.validateAsync(req.body, {
      errors: {
        label: false,
        wrap: {
          label: false,
        },
      },
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
  let cabang = await db.Cabang.findByPk(req.body.id_cabang);
  if (cabang.id_bioskop != req.user.id_bioskop) {
    return res.status(403).send({ message: "Anda bukan pemilik cabang" });
  }
  let ctr_no_studio = await db.Studio.count({
    where: {
      id_cabang: req.body.id_cabang,
    },
  });
  ctr_no_studio += 1;
  const new_id_studio =
    req.body.id_cabang + "-" + ctr_no_studio.toString().padStart(2, "0");
  const c = await db.Cabang.findByPk(req.body.id_cabang);

  await c.createStudio({
    id_studio: new_id_studio,
    id_cabang: req.body.id_cabang,
    nomor_studio: ctr_no_studio,
    jenis_studio: req.body.jenis_studio,
    baris: req.body.baris,
    kolom: req.body.kolom,
    id_bioskop: req.user.id_bioskop,
  });

  return res.status(201).send({
    message: "Studio berhasil dibuat",
    id_studio: new_id_studio,
    id_cabang: req.body.id_cabang,
    nomor_studio: ctr_no_studio,
    jenis_studio: req.body.jenis_studio,
    baris: req.body.baris,
    kolom: req.body.kolom,
    id_bioskop: req.user.id_bioskop,
  });
};

//Input: id_studio, movie_id (sesuai imdb), harga, jadwal tayang
const registerJadwal = async (req, res) => {
  const validator = Joi.object({
    id_studio: Joi.string()
      .external(checkValidId_Studio)
      .required()
      .label("ID Studio")
      .messages({
        "any.required": "{{#label}} harus ada",
        "string.empty": "{{#label}} tidak boleh blank",
      }),
    id_film: Joi.string().required().label("ID Film").messages({
      "any.required": "{{#label}} harus ada",
      "string.empty": "{{#label}} tidak boleh blank",
    }),
    harga: Joi.number().required().label("Harga").integer().min(1).messages({
      "any.required": "{#label} harus diisi",
      "number.empty": "{{#label}} tidak boleh blank",
      "number.min": "{{#label}} harus lebih dari Rp. 0",
    }),
    jadwal_tayang: Joi.date()
      .required()
      .label("Jadwal tayang")
      .format("YYYY-MM-DD HH:mm")
      .greater(Date.now() + 48 * 60 * 60 * 1000)
      .messages({
        "any.required": "{#label} harus diisi",
        "date.base": "{{#label}} harus berupa YYYY-MM-DD HH:mm",
        "date.format": "{{#label}} harus berupa YYYY-MM-DD HH:mm",
        "date.greater": "{{#label}} minimal dua hari kedepan dari sekarang",
      }),
  });
  try {
    const validationResult = await validator.validateAsync(req.body, {
      errors: {
        label: false,
        wrap: {
          label: false,
        },
      },
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
  const studio = await db.Studio.findByPk(req.body.id_studio);
  const ownerStudio = await (await studio.getCabang()).getBioskop();
  if (ownerStudio.id_bioskop != req.user.id_bioskop) {
    return res
      .status(403)
      .send({ message: "Autentikasi gagal. Anda bukan pemilik studio" });
  }
  let movie_details;
  try {
    movie_details = await axios.get(
      "https://imdb8.p.rapidapi.com/title/get-overview-details",
      {
        params: {
          tconst: req.body.id_film,
          currentCountry: "US",
        },
        headers: {
          "X-RapidAPI-Key": IMDB_API_KEY,
          "X-RapidAPI-Host": "imdb8.p.rapidapi.com",
        },
      }
    );
    if (!movie_details.data) {
      return res.status(404).send({ message: "Film tidak ditemukan" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
  if (movie_details.data.title.titleType != "movie") {
    return res
      .status(400)
      .send({ message: "Judul yang diinputkan bukan merupakan film" });
  }
  let judul_film = movie_details.data.title.title;
  let durasi = movie_details.data.title.runningTimeInMinutes;
  let synopsis = movie_details.data.plotOutline.text;
  let age_rating = movie_details.data.certificates.US[0].certificate;
  let ctr_jadwal = (await db.Jadwal.max("id_jadwal")) || "JW00000";
  let int_jadwal = parseInt(ctr_jadwal.substring(2)) + 1;
  let new_id_jadwal = "JW" + int_jadwal.toString().padStart(5, "0");
  const t = await db.sequelize.transaction();
  kursi_tersedia = [];
  try {
    const newJadwal = await studio.createJadwal({
      id_jadwal: new_id_jadwal,
      id_film: req.body.id_film,
      judul_film,
      durasi,
      synopsis,
      age_rating,
      jadwal_tayang: req.body.jadwal_tayang,
      harga: req.body.harga,
    });
    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 1; i <= studio.baris; i++) {
      for (let j = 1; j <= studio.kolom; j++) {
        newJadwal.createTiket({
          id_tiket:
            alphabets.charAt(i - 1) +
            j.toString().padStart(2, "0") +
            new_id_jadwal,
          nomor_kursi: alphabets.charAt(i - 1) + j.toString().padStart(2, "0"),
          status: 0,
        });
        kursi_tersedia.push(
          alphabets.charAt(i - 1) + j.toString().padStart(2, "0")
        );
      }
    }
    await t.commit();
    return res.status(201).send({
      id_jadwal: new_id_jadwal,
      judul_film,
      harga: req.body.harga,
      durasi,
      synopsis,
      age_rating,
      jadwal_tayang: req.body.jadwal_tayang,
      kursi_tersedia,
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  registerCabang,
  registerStudio,
  registerJadwal,
  validateBioskopAPIKey,
  getCabang,
  getJadwal,
  getSales,
  editTiket,
  deleteCabang,
};
