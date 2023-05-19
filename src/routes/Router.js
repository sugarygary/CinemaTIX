const express = require("express");
const userRouter = require("./userRouter");
const bioskopRouter = require("./bioskopRouter");
const router = express.Router();

router.use("/users", userRouter);
router.use("/bioskop", bioskopRouter);
// router.use("/webreview", webRouter);

module.exports = router;
