require("dotenv").config();
const express = require("express");
const Router = require("./src/routes/Router");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", Router);
const { PORT } = process.env;
app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}...`);
});
