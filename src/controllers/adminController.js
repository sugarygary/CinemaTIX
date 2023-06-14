const { response } = require("express");
const express = require("express");
const db = require("../models");
const { Op } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));

const accWebReview = async (req, res) => {
  const validator = Joi.object({
    bukti_pembayaran: Joi.string().required(),
  });

  let token = req.header("x-api-key");
  const validationResult = await validator.validateAsync(req.params);

  if (!token) {
    return res.status(403).send({
      msg: "unauthorized",
    });
  } else {
    if (token == "admin") {
      const cekPembayaran = await db.Pembayaran.findOne({
        where: {
          bukti_pembayaran: validationResult.bukti_pembayaran,
        },
      });

      if (cekPembayaran != null) {
        if (cekPembayaran.status != "Paid") {
          user = await db.Pembayaran.update(
            {
              status: "Paid",
            },
            {
              where: {
                bukti_pembayaran: validationResult.bukti_pembayaran,
              },
            }
          );

          return res.status(200).send({
            msg: "Pembayaran diterima",
          });
        } else {
          return res.status(400).send({
            msg: "Pembayaran sudah dikonfirmasi",
          });
        }
      } else {
        return res.status(404).send({
          msg: "bukti pembayaran invalid",
        });
      }
    } else {
      return res.status(400).send({
        msg: "anda bukan admin",
      });
    }
  }
};

module.exports = {
  accWebReview,
};
