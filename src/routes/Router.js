const express = require("express");
const userRouter = require("./userRouter");
const bioskopRouter = require("./bioskopRouter");
const webRouter = require("./webRouter");
const adminRouter = require("./adminRouter");
const router = express.Router();

router.use("/users", userRouter);
router.use("/bioskop", bioskopRouter);
router.use("/webreview", webRouter);
router.use("/admin", adminRouter);

module.exports = router;
