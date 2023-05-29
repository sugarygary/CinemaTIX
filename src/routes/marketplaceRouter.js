const express = require("express");
const db = require("../models");
const marketplaceRouter = express.Router();
const Joi = require("joi");

const {
    queryBioskop,
    showCabang
} = require("../controllers/marketplaceController");

marketplaceRouter.get("/detail-bioskop", queryBioskop);
marketplaceRouter.get("/show-bioskop", showCabang);

module.exports = marketplaceRouter;
