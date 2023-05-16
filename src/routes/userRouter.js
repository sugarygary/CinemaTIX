const express = require("express");
const db = require("../models");
const userRouter = express.Router();
const Joi = require("joi");

const {
  registerBioskop,
  // registerMarketplace,
  // registerWebreview,
  loginBioskop,
  // loginMarketplace,
  // loginWebreview,
} = require('../controllers/userController')


userRouter.post("/register-bioskop",registerBioskop );

userRouter.post("/login-bioskop",loginBioskop );

module.exports = userRouter;
