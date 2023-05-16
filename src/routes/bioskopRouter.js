const express = require("express");
const db = require("../models");
const bioskopRouter = express.Router();
const Joi = require("joi");

const {
  registerCabang,
  registerStudio
} = require('../controllers/bioskopController')


bioskopRouter.post("/register-cabang", registerCabang );
bioskopRouter.post("/register-studio", registerStudio );



module.exports = bioskopRouter;
