const db = require("../models");

const accWebReview = async (req, res) => {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).send({
      message: "Invalid API Key",
    });
  } else {
    if (token == "admin") {
      let subs = await db.Subscription.findByPk(req.params.id_subscription);
      if (!subs) {
        return res
          .status(404)
          .send({ message: "Permintaan subcription tidak ditemukan" });
      }
      if (subs.status == "Paid") {
        return res
          .status(400)
          .send({ message: "Permintaan subcription sudah dikonfirmasi" });
      }
      await subs.update({ status: "Paid" });
      return res
        .status(200)
        .send({ message: "Permintaan subscription berhasil diaktifkan" });
    } else {
      return res.status(403).send({
        message: "Unauthorized access",
      });
    }
  }
};

module.exports = {
  accWebReview,
};
