const express = require("express");
const Router = require("./src/routes/Router");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", Router);
const port = 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}...`);
});
