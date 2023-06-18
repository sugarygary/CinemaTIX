const express = require("express");
const db = require("../models");
const adminRouter = express.Router();
const Joi = require("joi");

const {
  accMarketPlace,
  accWebReview,
  approveTiket,
  rejectTiket,
  getRequestTiket,
} = require("../controllers/adminController");

adminRouter.put("/acc-tiket/:id_tiket", approveTiket);
adminRouter.put("/reject-tiket/:id_tiket", rejectTiket);
adminRouter.get("/pending-tiket", getRequestTiket);
adminRouter.post("/acc-web-review/:id_subscription", accWebReview);

module.exports = adminRouter;
