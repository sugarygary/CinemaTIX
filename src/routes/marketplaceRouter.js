const express = require("express");
const marketplaceRouter = express.Router();

const {
  pesanTiket,
  queryBioskop,
  showCabang,
  showJadwal,
  showKursi,
  search_jadwal_by_movie,
  showTiket,
} = require("../controllers/marketplaceController");

marketplaceRouter.post("/pesan-tiket", pesanTiket);
marketplaceRouter.get("/detail-bioskop", queryBioskop);
marketplaceRouter.get("/show-bioskop/:id_bioskop", showCabang);
marketplaceRouter.get("/show-jadwal-by-cabang/:id_cabang", showJadwal);
marketplaceRouter.get("/show-jadwal-by-movie/:id_film", search_jadwal_by_movie);
marketplaceRouter.get("/show-kursi/:id_jadwal", showKursi);
marketplaceRouter.get("/show-tiket", showTiket);

module.exports = marketplaceRouter;
