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
    fileSize: 100000000,
  },
});

const {
  queryBioskop,
  showJadwal,
  pembayaran,
  nowShowing,
  cekSubscription,
  nowShowing_2,
  comingSoon,
} = require("../controllers/webController");

webRouter.get("/query-bioskop", cekSubscription, queryBioskop);
webRouter.get(
  "/show-jadwal/:movie_id/:id_bioskop?",
  cekSubscription,
  showJadwal
);
webRouter.post("/pembayaran", pembayaran);
webRouter.get("/now-showing", cekSubscription, nowShowing_2);
webRouter.get("/coming-soon", cekSubscription, comingSoon);

module.exports = webRouter;
