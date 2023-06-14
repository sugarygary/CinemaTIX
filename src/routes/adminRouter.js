const express = require("express");
const db = require("../models");
const adminRouter = express.Router();
const Joi = require("joi");

const {
  accMarketPlace,
  accWebReview,
} = require("../controllers/adminController");

//adminRouter.post("/acc-market-place", registerCabang);
adminRouter.post("/acc-web-review/:id_subscription", accWebReview);

module.exports = adminRouter;
