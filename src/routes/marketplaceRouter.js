const express = require("express");
const marketplaceRouter = express.Router();
const multer = require("multer");
const upload = multer({
    dest: "./uploads",
    fileFilter: function (req, file, cb) {
      if (file.mimetype != "image/png" && file.mimetype != "image/jpeg") {
        return cb(new Error("Wrong file type"), null);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 100000000
    }
});

const {
    pesanTiket,
    queryBioskop,
    showCabang,
    showJadwal,
    showKursi
} = require("../controllers/marketplaceController");

marketplaceRouter.post("/pesan-tiket", upload.single("bukti_pembayaran"), pesanTiket);
marketplaceRouter.get("/detail-bioskop", queryBioskop);
marketplaceRouter.get("/show-bioskop", showCabang);
marketplaceRouter.get("/show-jadwal", showJadwal);
marketplaceRouter.get("/show-kursi/:id_jadwal", showKursi);

module.exports = marketplaceRouter;
