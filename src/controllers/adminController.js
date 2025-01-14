const db = require("../models");
const HEADER_ADMIN = process.env.HEADER_ADMIN;
function randomBarcodeKey(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
const accWebReview = async (req, res) => {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).send({
      message: "Invalid API Key",
    });
  }
  if (token == HEADER_ADMIN) {
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
};

const pendingSubscription = async function (req, res) {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).send({
      message: "Invalid API Key",
    });
  }
  if (token == HEADER_ADMIN) {
    let subscription = await db.Subscription.findAll({
      where: { status: "Pending" },
      attributes: { exclude: ["status"] },
    });
    return res.status(200).send(subscription);
  } else {
    return res.status(403).send({
      message: "Unauthorized access",
    });
  }
};

const approveTiket = async (req, res) => {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).send({
      message: "Invalid API Key",
    });
  }
  if (token == HEADER_ADMIN) {
    let id_history = req.params.id_history;
    let history = await db.History.findOne({ where: { id_history } });
    if (!history) {
      return res.status(404).send({
        message: "Tiket tidak ditemukan",
      });
    }
    if (history.status != 0) {
      return res.status(400).send({
        message: "Tiket sudah diproses",
      });
    }
    let tiket = await history.getTiket();
    console.log(tiket);
    let barcode_key = randomBarcodeKey(16);
    for (;;) {
      let checkDup = await db.Tiket.findOne({ where: { barcode_key } });
      if (checkDup) {
        barcode_key = randomBarcodeKey(16);
        continue;
      }
      break;
    }
    await tiket.update({ barcode_key });
    await history.update({ status: 1 });
    return res.status(200).send({ message: "Tiket berhasil di approve" });
  } else {
    return res.status(403).send({
      message: "Unauthorized access",
    });
  }
};
const rejectTiket = async (req, res) => {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).send({
      message: "Invalid API Key",
    });
  }
  if (token == HEADER_ADMIN) {
    let id_history = req.params.id_history;
    let history = await db.History.findOne({ where: { id_history } });
    if (!history) {
      return res.status(404).send({
        message: "Tiket tidak ditemukan",
      });
    }
    if (history.status != 0) {
      return res.status(400).send({
        message: "Tiket sudah diproses",
      });
    }
    let tiket = await history.getTiket();
    await tiket.update({ status: 0 });
    await history.update({ status: 2 });
    return res.status(200).send({ message: "Tiket berhasil di reject" });
  } else {
    return res.status(403).send({
      message: "Unauthorized access",
    });
  }
};
const getRequestTiket = async (req, res) => {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).send({
      message: "Invalid API Key",
    });
  }
  if (token == HEADER_ADMIN) {
    let history = await db.History.findAll({
      where: { status: 0 },
      attributes: { exclude: ["status"] },
    });
    return res.status(200).send(history);
  } else {
    return res.status(403).send({
      message: "Unauthorized access",
    });
  }
};

const revokeMarketplace = async (req, res) => {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).send({
      message: "Invalid API Key",
    });
  }
  if (token == HEADER_ADMIN) {
    const username = req.params.username;
    const marketplace = await db.Marketplace.findByPk(username);
    if (!marketplace) {
      return res.status(404).send({ message: "Marketplace tidak ditemukan" });
    }
    if (!marketplace.api_key) {
      return res
        .status(400)
        .send({ message: "Akun sudah di revoke sebelumnya" });
    }
    await marketplace.update({ api_key: null });
    return res.status(200).send({ message: "Akun berhasil di revoke" });
  } else {
    return res.status(403).send({
      message: "Unauthorized access",
    });
  }
};

const detail_pembayaran_subs = async function (req, res) {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).send({
      message: "Invalid API Key",
    });
  }
  if (token == HEADER_ADMIN) {
    let subscription = await db.Subscription.findByPk(
      req.params.id_subscription
    );
    if (!subscription) {
      return res
        .status(404)
        .send({ message: "Request subscription tidak ditemukan" });
    }
    const nama_file = subscription.bukti_pembayaran;
    const lokasinya = `uploads/subscription/${nama_file}`;
    return res.status(200).sendFile(lokasinya, { root: "." });
  } else {
    return res.status(403).send({
      message: "Unauthorized access",
    });
  }
};
const detail_pembayaran_tiket = async function (req, res) {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).send({
      message: "Invalid API Key",
    });
  }
  if (token == HEADER_ADMIN) {
    let history = await db.History.findByPk(req.params.id_history);
    if (!history) {
      return res.status(404).send({ message: "Request tiket tidak ditemukan" });
    }
    // const nama_file = history.bukti_pembayaran;
    const lokasinya = `uploads/tiket/${req.params.id_history}.jpg`;
    return res.status(200).sendFile(lokasinya, { root: "." });
  } else {
    return res.status(403).send({
      message: "Unauthorized access",
    });
  }
};

module.exports = {
  accWebReview,
  approveTiket,
  rejectTiket,
  getRequestTiket,
  revokeMarketplace,
  detail_pembayaran_subs,
  detail_pembayaran_tiket,
  pendingSubscription,
};
