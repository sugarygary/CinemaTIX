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
  detail_pembayaran_subs,
  detail_pembayaran_tiket,
  pendingSubscription,
} = require("../controllers/adminController");

adminRouter.put("/acc-tiket/:id_tiket", approveTiket);
adminRouter.put("/reject-tiket/:id_tiket", rejectTiket);
adminRouter.put("/acc-web-review/:id_subscription", accWebReview);
adminRouter.delete("/revoke-marketplace/:username", revokeMarketplace);
adminRouter.get("/pending-tiket", getRequestTiket);
adminRouter.get("/pending-subscription", pendingSubscription);
adminRouter.get("/pending-tiket-details/:id_history", detail_pembayaran_tiket);
adminRouter.get(
  "/pending-subscription-details/:id_subscription",
  detail_pembayaran_subs
);

module.exports = adminRouter;
