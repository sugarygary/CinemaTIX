const express = require("express");
const marketplaceRouter = express.Router();
const multer = require("multer");
const upload = multer({
  fileFilter: function (req, file, cb) {
    if (file.mimetype != "image/png" && file.mimetype != "image/jpeg") {
      return cb(new Error("Wrong file type"), null);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 100000000,
  },
});

const {
  pesanTiket,
  queryBioskop,
  showCabang,
  showJadwal,
  showKursi,
  search_jadwal_by_movie,
} = require("../controllers/marketplaceController");

marketplaceRouter.post(
  "/pesan-tiket",
  upload.single("bukti_pembayaran"),
  pesanTiket
);
marketplaceRouter.get("/detail-bioskop", queryBioskop);
marketplaceRouter.get("/show-bioskop/:id_bioskop", showCabang);
marketplaceRouter.get("/show-jadwal-by-cabang/:id_cabang", showJadwal);
marketplaceRouter.get("/show-jadwal-by-movie/:id_film", search_jadwal_by_movie);
marketplaceRouter.get("/show-kursi/:id_jadwal", showKursi);

module.exports = marketplaceRouter;
