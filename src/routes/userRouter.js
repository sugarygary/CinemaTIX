const express = require("express");
const db = require("../models");
const userRouter = express.Router();
const Joi = require("joi");
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function randomApiKey(length) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
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
userRouter.post("/register-bioskop", async function (req, res) {
  const validator = Joi.object({
    name: Joi.string().required().label("Name Pengguna").messages({
      "any.required": "{{#label}} harus ada",
      "string.empty": "{{#label}} tidak boleh blank",
    }),
    username: Joi.string()
      .external(checkUniqueBioskop_username)
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
    let ctrID = (await db.Bioskop.max("id_bioskop")) || "B000";
    let intID = parseInt(ctrID.substring(1)) + 1;
    let new_id = "B" + intID.toString().padStart(3, "0");
    let api_key = randomApiKey(10);
    user = await db.Bioskop.create({
      id_bioskop: new_id,
      username: validationResult.username,
      nama: validationResult.name,
      password: validationResult.password,
      api_key: api_key,
    });

    return res.status(201).send({
      msg: "akun berhasil dibuat",
      username: validationResult.username,
      name: validationResult.name,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

module.exports = userRouter;
