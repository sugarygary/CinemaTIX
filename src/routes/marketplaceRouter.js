const express = require("express");
const db = require("../models");
const marketplaceRouter = express.Router();
const Joi = require("joi");

const {
    queryBioskop,
    showCabang,
    showJadwal,
    showKursi
} = require("../controllers/marketplaceController");

marketplaceRouter.get("/detail-bioskop", queryBioskop);
marketplaceRouter.get("/show-bioskop", showCabang);
marketplaceRouter.get("/show-jadwal", showJadwal);
marketplaceRouter.get("/show-kursi/:id_jadwal", showKursi);

module.exports = marketplaceRouter;
