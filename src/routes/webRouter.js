const express = require("express");
const db = require("../models");
const webRouter = express.Router();
const Joi = require("joi");
const multer = require("multer");
const upload = multer({
  fileFilter: function (req, file, cb) {
    if (file.mimetype != "image/jpg" && file.mimetype != "image/jpeg") {
      return cb(new Error("Wrong file type"), null);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 100000000
  }
});

const {
  queryBioskop,
  showJadwal,
  pembayaran,
  nowShowing
} = require("../controllers/webController");

webRouter.get("/query-bioskop", queryBioskop);
webRouter.get("/show-jadwal/:movie_id/:id_bioskop?", showJadwal);
webRouter.post("/pembayaran", upload.single("bukti_pembayaran"), pembayaran);
webRouter.get("/now-showing-films",nowShowing);

module.exports = webRouter;
