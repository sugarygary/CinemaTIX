const fs = require("fs");
const db = require("../models");
const { Op } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));
const multer = require("multer");

async function cekSubscription(req, res, next) {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).send({ message: "API Key harus diisi" });
  }
  const requester = await db.WebReview.findOne({
    where: {
      api_key: token,
    },
  });
  if (!requester) {
    return res.status(401).send({ message: "API Key Invalid" });
  }
  let lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 30);
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
  let alreadySubscribed = await db.Subscription.findOne({
    where: {
      tanggal_pembayaran: { [Op.gt]: lmdateTime },
      id_web_review: requester.id_web_review,
    },
  });
  if (!alreadySubscribed) {
    return res
      .status(403)
      .send({ message: "Anda belum berlangganan dengan CinemaTIX API" });
  }
  if (alreadySubscribed.status != "Paid") {
    return res
      .status(403)
      .send({ message: "Pembayaran langganan anda sedang diproses" });
  }
  next();
}

const queryBioskop = async (req, res) => {
  let query = req.query.nama_bioskop;
  let option = {
    attributes: ["id_bioskop", "nama"],
  };
  if (query) {
    option.where = { nama: { [Op.substring]: query } };
  }
  let queryResult = await db.Bioskop.findAll(option);
  if (queryResult.length == 0) {
    return res.status(404).send({ message: "Bioskop tidak ditemukan" });
  }
  return res.status(200).send(queryResult);
};

const showJadwal = async (req, res) => {
  const validator = Joi.object({
    movie_id: Joi.string().required(),
    id_bioskop: Joi.string(),
  });
  const { error, value } = await validator.validateAsync(req.params);
  if (error) {
    return res.status(400).send({ message: "Movie ID harus diisi" });
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
  if (req.params.id_bioskop) {
    let bioskop = await db.Bioskop.findOne({
      where: {
        id_bioskop: req.params.id_bioskop,
      },
    });
    if (bioskop) {
      let jadwal = [];
      let tempjadwal = await db.Jadwal.findAll({
        where: {
          id_film: req.params.movie_id,
          jadwal_tayang: { [Op.gte]: dateTime },
        },
      });
      for (let i = 0; i < tempjadwal.length; i++) {
        const element = tempjadwal[i];
        let getCabang = await (await element.getStudio()).getCabang();
        if (getCabang.id_bioskop == req.params.id_bioskop) {
          jadwal.push(element);
        }
      }
      let result = [];
      if (jadwal.length > 0) {
        for (let i = 0; i < jadwal.length; i++) {
          const element = jadwal[i];
          const studio = await element.getStudio();
          const cabang = await studio.getCabang();
          const kursi_tersedia = await db.Tiket.count({
            where: { status: 0, id_jadwal: element.id_jadwal },
          });
          result.push({
            lokasi: cabang.nama,
            alamat: cabang.alamat,
            studio: parseInt(studio.nomor_studio),
            jam_tayang: element.jadwal_tayang,
            harga: element.harga,
            kursi_tersedia,
          });
        }
        return res.status(200).send(result);
      } else {
        return res.status(404).send({
          message: "Film tidak tayang pada bioskop ini",
        });
      }
    } else {
      return res.status(404).send({
        message: "Bioskop tidak terdaftar",
      });
    }
  } else {
    let jadwal = await db.Jadwal.findAll({
      where: {
        id_film: req.params.movie_id,
        jadwal_tayang: { [Op.gte]: dateTime },
      },
    });
    if (jadwal.length == 0) {
      return res.status(404).send({
        message: "Film tidak tayang di bioskop manapun",
      });
    }
    let result = [];
    for (let i = 0; i < jadwal.length; i++) {
      const element = jadwal[i];
      const studio = await element.getStudio();
      const cabang = await studio.getCabang();
      const kursi_tersedia = await db.Tiket.count({
        where: { status: 0, id_jadwal: element.id_jadwal },
      });
      result.push({
        lokasi: cabang.nama,
        alamat: cabang.alamat,
        studio: parseInt(studio.nomor_studio),
        jam_tayang: element.jadwal_tayang,
        harga: element.harga,
        kursi_tersedia,
      });
    }
    return res.status(200).send(result);
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
  let allFilm = await db.Jadwal.findAll();
  let today = new Date();
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
  return res.status(200).send(nowShowing);
};

const nowShowing_2 = async (req, res) => {
  let today = new Date();
  let date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    today.getDate().toString().padStart(2, "0");
  let film = await db.Jadwal.findAll({
    attributes: ["id_film", "judul_film", "durasi", "synopsis", "age_rating"],
    where: {
      jadwal_tayang: {
        [Op.like]: date + "%",
      },
    },
  });
  let distinct = [];
  film.map((x) =>
    distinct.filter(
      (a) =>
        a.id_film == x.id_film &&
        a.judul_film == x.judul_film &&
        a.durasi == x.durasi &&
        a.synopsis == x.synopsis &&
        a.age_rating == x.age_rating
    ).length > 0
      ? null
      : distinct.push(x)
  );
  if (distinct.length == 0) {
    return res
      .status(404)
      .send({ message: "Tidak ada film yang tayang hari ini" });
  }
  return res.status(200).send(distinct);
};

const comingSoon = async function (req, res) {
  let coming_soon = [];
  let today = new Date();
  let date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    today.getDate().toString().padStart(2, "0");
  let film = await db.Jadwal.findAll({
    attributes: ["id_film", "judul_film", "durasi", "synopsis", "age_rating"],
    where: {
      jadwal_tayang: {
        [Op.like]: date + "%",
      },
    },
  });
  let filmSoon = await db.Jadwal.findAll({
    attributes: ["id_film", "judul_film", "durasi", "synopsis", "age_rating"],
    where: {
      jadwal_tayang: {
        [Op.gt]: date,
      },
    },
  });
  for (let i = 0; i < filmSoon.length; i++) {
    const element = filmSoon[i];
    if (film.filter((x) => x.id_film == element.id_film).length > 0) {
      continue;
    }
    coming_soon.push(element);
  }
  let distinct = [];
  coming_soon.map((x) =>
    distinct.filter(
      (a) =>
        a.id_film == x.id_film &&
        a.judul_film == x.judul_film &&
        a.durasi == x.durasi &&
        a.synopsis == x.synopsis &&
        a.age_rating == x.age_rating
    ).length > 0
      ? null
      : distinct.push(x)
  );
  if (distinct.length == 0) {
    return res
      .status(404)
      .send({ message: "Tidak ada film yang akan segera tayang" });
  }
  return res.status(200).send(distinct);
};

module.exports = {
  queryBioskop,
  showJadwal,
  pembayaran,
  nowShowing,
  nowShowing_2,
  cekSubscription,
  comingSoon,
};
