const { default: axios } = require("axios");
const db = require("../models");
const { Op } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));
const IMDB_API_KEY = "a636df9869msh090dff929636d90p1f4196jsnc1d1abb1880c";

// Check Username di database
const checkValidId_Bioskop = async (username) => {
    const b = await db.Bioskop.findOne({
        where: {
            username: {
                [Op.eq] : username
            },
        },
    });
    if (b) {
        throw new Error("Username sudah terdaftar!!");
    } else {
        return username;
    }
};

const registerMarketplace = async (req, res) => {
    const validator = Joi.object({
        username: Joi.string()
            .external(checkValidUsername)
            .required()
            .label("Username")
            .messages({
                "any.required": "{{#label}} harus ada",
                "string.empty": "{{#label}} tidak boleh blank",
            }),
        name: Joi.string()
            .required()
            .label("Name")
            .messages({
                "any.required": "{{#label}} harus ada",
                "string.empty": "{{#label}} tidak boleh blank",
            }),
        password: Joi.string()
            .required()
            .label("Password")
            .min(8)
            .messages({
                "any.required": "{#label} harus diisi",
                "number.empty": "{{#label}} tidak boleh blank",
            }),
        confirm_password: Joi.number()
            .required()
            .label("Confirm Password")
            .min(8)
            .messages({
                "any.required": "{{#label}} harus diisi",
                "number.empty": "{{#label}} tidak boleh blank",
            })
        });

    try {
        const validationResult = await validator.validateAsync(req.body, {
            errors: {
                label: false,
                wrap: {
                    label: false,
                },
            },
        });
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }


}

module.exports = {
    registerMarketplace
};