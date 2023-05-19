const express = require("express");
const db = require("../models");
const userRouter = express.Router();
const Joi = require("joi");

const {
  registerBioskop,
  // registerMarketplace,
  registerWebReview,
  loginBioskop,
  // loginMarketplace,
  loginWebReview,
} = require('../controllers/userController')


userRouter.post("/register-bioskop",registerBioskop );
userRouter.post("/login-bioskop",loginBioskop );
userRouter.post("/register-webreview",registerWebReview );
userRouter.post("/login-webreview",loginWebReview );

module.exports = userRouter;
