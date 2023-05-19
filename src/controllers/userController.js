const { response } = require("express");
const express = require("express");
const db = require("../models");
const { Op } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));

const checkUniqueBioskop_username = async (username) => {
  const u = await db.Bioskop.findOne({
    where: {
      username: username,
    },
  });
  if (u) {
    throw new Error("Bioskop_username is not unique");
  } else {
    return username;
  }
};

function randomApiKey(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

const registerBioskop = async (req, res) => {
  const validator = Joi.object({
    nama: Joi.string().required().label("Nama Bioskop").messages({
      "any.required": "{{#label}} harus ada",
      "string.empty": "{{#label}} tidak boleh blank",
    }),
    username: Joi.string()
      .external(checkUniqueBioskop_username)
      .required()
      .label("username Pengguna")
      .messages({
        "any.required": "{{#label}} harus diisi",
        "string.empty": "{{#label}} tidak boleh blank",
      }),

    password: Joi.string()
      .required()
      .alphanum()
      .min(5)
      .label("Password Pengguna")
      .messages({
        "any.required": "{{#label}} harus diisi",
        "string.min": "{{#label}} harus setidaknya 5 karakter",
        "string.empty": "{{#label}} tidak boleh blank",
      }),
  });
  try {
    const validationResult = await validator.validateAsync(req.body);
    let ctrID = (await db.Bioskop.max("id_bioskop")) || "B000";
    let intID = parseInt(ctrID.substring(1)) + 1;
    let new_id = "B" + intID.toString().padStart(3, "0");
    let api_key = randomApiKey(10);
    user = await db.Bioskop.create({
      id_bioskop: new_id,
      username: validationResult.username,
      nama: validationResult.nama,
      password: validationResult.password,
      api_key: api_key,
    });

    return res.status(201).send({
      msg: "akun berhasil dibuat",
      username: validationResult.username,
      nama: validationResult.nama,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const checkLogin_Bioskop_username = async (username) => {
  const u = await db.Bioskop.findOne({
    where: {
      username: username,
    },
  });
  if (u) {
    return username;
  } else {
    throw new Error("username invalid");
  }
};

const loginBioskop = async (req, res) => {
  const validator = Joi.object({
    username: Joi.string()
      .external(checkLogin_Bioskop_username)
      .required()
      .label("username Pengguna")
      .messages({
        "any.required": "{{#label}} harus diisi yaa",
        "string.empty": "{{#label}} tidak boleh blank",
      }),
    password: Joi.string()
      .required()
      .alphanum()
      .min(5)
      .label("Password Pengguna")
      .messages({
        "any.required": "{{#label}} harus diisi yaa",
        "string.min": "{{#label}} harus setidaknya 5 karakter",
        "string.empty": "{{#label}} tidak boleh blank",
      }),
  });
  try {
    const validationResult = await validator.validateAsync(req.body);

    const u = await db.Bioskop.findOne({
      where: {
        username: validationResult.username,
        password: validationResult.password,
      },
    });
    if (u) {
      return res.status(200).send({
        msg: "Berhasil Login",
        username: u.username,
        api_key: u.api_key,
      });
    } else {
      return res.status(400).send({
        msg: "Gagal Login",
      });
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
const checkUniqueWebReview_username = async (username) => {
  const u = await db.WebReview.findOne({
    where: {
      username: username,
    },
  });
  if (u) {
    throw new Error("WebReview_username is not unique");
  } else {
    return username;
  }
};
const registerWebReview = async (req, res) => {
  const validator = Joi.object({
    nama_web_review: Joi.string().required().label("Nama Web Review").messages({
      "any.required": "{{#label}} harus ada",
      "string.empty": "{{#label}} tidak boleh blank",
    }),
    username: Joi.string()
      .external(checkUniqueWebReview_username)
      .required()
      .label("username Pengguna")
      .messages({
        "any.required": "{{#label}} harus diisi",
        "string.empty": "{{#label}} tidak boleh blank",
      }),

    password: Joi.string()
      .required()
      .alphanum()
      .min(5)
      .label("Password Pengguna")
      .messages({
        "any.required": "{{#label}} harus diisi",
        "string.min": "{{#label}} harus setidaknya 5 karakter",
        "string.empty": "{{#label}} tidak boleh blank",
      }),
  });
  try {
    const validationResult = await validator.validateAsync(req.body);
    let ctrID = (await db.WebReview.max("id_web_review")) || "WR000";
    console.log(ctrID)
    let intID = parseInt(ctrID.substring(2)) + 1;
    console.log(intID)
    let new_id = "WR" + intID.toString().padStart(3, "0");
    console.log(new_id)
    let api_key = randomApiKey(10);
    user = await db.WebReview.create({
      id_web_review: new_id,
      username: validationResult.username,
      nama_web_review: validationResult.nama_web_review,
      password: validationResult.password,
      api_key: api_key,
    });

    return res.status(201).send({
      msg: "akun berhasil dibuat",
      username: validationResult.username,
      nama_web_review: validationResult.nama_web_review,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
}
const checkLogin_WebReview_username = async (username) => {
  const u = await db.WebReview.findOne({
    where: {
      username: username,
    },
  });
  if (u) {
    return username;
  } else {
    throw new Error("username invalid");
  }
};
const loginWebReview = async (req, res) => {
  const validator = Joi.object({
    username: Joi.string()
      .external(checkLogin_WebReview_username)
      .required()
      .label("username Pengguna")
      .messages({
        "any.required": "{{#label}} harus diisi yaa",
        "string.empty": "{{#label}} tidak boleh blank",
      }),
    password: Joi.string()
      .required()
      .alphanum()
      .min(5)
      .label("Password Pengguna")
      .messages({
        "any.required": "{{#label}} harus diisi yaa",
        "string.min": "{{#label}} harus setidaknya 5 karakter",
        "string.empty": "{{#label}} tidak boleh blank",
      }),
  });
  try {
    const validationResult = await validator.validateAsync(req.body);

    const u = await db.WebReview.findOne({
      where: {
        username: validationResult.username,
        password: validationResult.password,
      },
    });
    if (u) {
      return res.status(200).send({
        msg: "Berhasil Login",
        username: u.username,
        api_key: u.api_key,
      });
    } else {
      return res.status(400).send({
        msg: "Gagal Login",
      });
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
}

module.exports = {
  registerBioskop,
  // registerMarketplace,
  registerWebReview,
  loginBioskop,
  // loginMarketplace,
  loginWebReview,
};
