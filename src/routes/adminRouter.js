const express = require("express");
const db = require("../models");
const adminRouter = express.Router();
const Joi = require("joi");

const {
  accWebReview,
  approveTiket,
  rejectTiket,
  getRequestTiket,
  revokeMarketplace,
} = require("../controllers/adminController");

adminRouter.put("/acc-tiket/:id_tiket", approveTiket);
adminRouter.put("/reject-tiket/:id_tiket", rejectTiket);
adminRouter.get("/pending-tiket", getRequestTiket);
adminRouter.put("/acc-web-review/:id_subscription", accWebReview);
adminRouter.delete("/revoke-marketplace/:username", revokeMarketplace);

module.exports = adminRouter;
