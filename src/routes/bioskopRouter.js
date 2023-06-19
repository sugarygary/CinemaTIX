const express = require("express");
const db = require("../models");
const bioskopRouter = express.Router();
const Joi = require("joi");

const {
  registerCabang,
  registerStudio,
  validateBioskopAPIKey,
  registerJadwal,
  getCabang,
  getJadwal,
  getSales,
  editTiket,
  deleteCabang,
} = require("../controllers/bioskopController");

bioskopRouter.post("/register-cabang", validateBioskopAPIKey, registerCabang);
bioskopRouter.post("/register-studio", validateBioskopAPIKey, registerStudio);
bioskopRouter.post("/register-jadwal", validateBioskopAPIKey, registerJadwal);
bioskopRouter.get("/cabang", validateBioskopAPIKey, getCabang);
bioskopRouter.get("/sales-report", validateBioskopAPIKey, getSales);
bioskopRouter.get("/jadwal/:id_cabang", validateBioskopAPIKey, getJadwal);
bioskopRouter.put("/void-tiket", validateBioskopAPIKey, editTiket);
bioskopRouter.delete(
  "/delete-cabang/:id_cabang",
  validateBioskopAPIKey,
  deleteCabang
);

module.exports = bioskopRouter;
