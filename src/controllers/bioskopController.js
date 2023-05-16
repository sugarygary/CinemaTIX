const { response } = require("express");
const express = require("express");
const db = require("../models");
const { Op } = require("sequelize");
const { valid } = require("joi");
const Joi = require('joi').extend(require('@joi/date'))


const checkValidId_Bioskop = async (id_bioskop) => {
    const b = await db.Bioskop.findOne({
        where: {
            id_bioskop: id_bioskop
        }
    })
    if (b) {
        return id_bioskop
    } else {
        throw new Error("Bioskop invalid, Bioskop tidak terdaftar")
    }
}
const registerCabang = async (req, res) => {
    let api_key = req.header('x-auth-token')
    if (!api_key) {
        return res.status(403).send("unauthorized")
    }
    const u = await db.Bioskop.findOne({
        where: {
            api_key: api_key,
            // id_bioskop: req.body.id_bioskop
        }
    })
    if (!u) {
        return res.status(400).send("api_key tidak valid (cek api_key apakah sesuai dengan bioskop yang mendaftar)")
    }
    const validator = Joi.object({
        id_bioskop: Joi.string()
            .external(checkValidId_Bioskop)
            .required()
            .label("Id Bioskop")
            .messages({
                "any.required": "{{#label}} harus ada",
                "string.empty": "{{#label}} tidak boleh blank"
            }),

        alamat: Joi.string()
            .required()
            .label("Alamat")
            .messages({
                "any.required": "{{#label}} harus diisi yaa",
                "string.empty": "{{#label}} tidak boleh blank",
            }),
    })
    try {
        const validationResult = await validator.validateAsync(req.body)
        const c = await db.Cabang.findAll()

        const b = await db.Bioskop.findOne({
            where: {
                id_bioskop: validationResult.id_bioskop
            }
        })

        let id_cabang = b.username;
        if (c.length + 1 < 10) {
            id_cabang = id_cabang + "00" + parseInt(c.length + 1)
        } else if (c.length + 1 < 100) {
            id_cabang = id_cabang + "0" + parseInt(c.length + 1)
        } else if (c.length + 1 >= 100) {
            id_cabang = id_cabang + parseInt(c.length + 1)
        }

        cabang = await db.Cabang.create({
            id_cabang: id_cabang,
            id_bioskop: validationResult.id_bioskop,
            alamat: validationResult.alamat
        });

        return res.status(201).send({
            msg: "cabang berhasil dibuat",
            id_cabang: id_cabang,
            id_bioskop: validationResult.id_bioskop,
            alamat: validationResult.alamat
        });

    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const checkValidId_Cabang = async (id_cabang) => {
    const c = await db.Cabang.findOne({
        where: {
            id_cabang: id_cabang
        }
    })
    if (c) {
        return id_cabang
    } else {
        throw new Error("id_cabang invalid, Cabang tidak terdaftar")
    }
}


const registerStudio = async (req, res) => {
    let api_key = req.header('x-auth-token')
    if (!api_key) {
        return res.status(403).send("unauthorized")
    }
    //cocokin api_key nya apakah ada user yang punya api_key itu
    const u = await db.Bioskop.findOne({
        where: {
            api_key: api_key
        }
    })
    if (!u) {
        return res.status(404).send("api_key invalid, api_key tidak ditemukan")
    }
    //kalo ada user yang punya api_key itu, cek lagi apakah user tersebut pemilik dari cabang yang diinput

    const validator = Joi.object({
        id_cabang: Joi.string()
            .external(checkValidId_Cabang)
            .required()
            .label("Id Cabang")
            .messages({
                "any.required": "{{#label}} harus ada",
                "string.empty": "{{#label}} tidak boleh blank"
            }),
        baris: Joi.number()
            .required()
            .label("baris studio")
            .integer()
            .min(1)
            .messages({
                "any.required": "{{#label}} harus diisi yaa",
                "string.empty": "{{#label}} tidak boleh blank"
            }),
        kolom: Joi.number()
            .required()
            .label("kolom studio")
            .integer()
            .min(1)
            .messages({
                "any.required": "{{#label}} harus diisi yaa",
                "string.empty": "{{#label}} tidak boleh blank",
            }),
        jenis_studio: Joi.string()
            .required()
            .label("jenis studio")
            .messages({
                "any.required": "{{#label}} harus diisi yaa",
                "string.empty": "{{#label}} tidak boleh blank",
            }),
        nomor_studio: Joi.number()
            .required()
            .label("nomor studio")
            .integer()
            .min(1)
            .messages({
                "any.required": "{{#label}} harus diisi yaa",
                "string.empty": "{{#label}} tidak boleh blank",
            }),

    })
    // const ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    try {
        const validationResult = await validator.validateAsync(req.body)
        const c = await db.Cabang.findOne({
            where: {
                id_bioskop: u.id_bioskop
            }
        })
        if (!c) {
            return res.status(400).send("user yang login bukan pemilik cabang bioskop tersebut ")
        }

        const b = await db.Bioskop.findOne({
            where: {
                api_key: api_key
            }
        })

        if (!c) {
            return res.status(400).send("user yang login bukan pemilik cabang bioskop tersebut ")
        }

        const cek_no_studio = await db.Studio.findOne({
            where: {
                id_cabang: validationResult.id_cabang,
                nomor_studio: req.body.nomor_studio
            }
        })
        if (cek_no_studio) {
            return res.status(400).send("nomor studio itu sudah terdaftar untuk cabang tersebut ")
        }

        const s = await db.Studio.findAll({
            where: {
                id_cabang: validationResult.id_cabang
            }
        })
        let ctr_id_studio_now
        let new_id_studio
        console.log("ini s nya" + s[0])
        if (!s[0]) {
            new_id_studio = validationResult.id_cabang + "-001"
            console.log("aaaaa")
        } else {
            console.log("bbbb")
            new_id_studio = validationResult.id_cabang
            ctr_id_studio_now = parseInt(s[s.length - 1].id_studio.substring(s[s.length - 1].id_studio.length - 3))
            if (ctr_id_studio_now + 1 < 10) {
                new_id_studio = new_id_studio + "-00" + parseInt(ctr_id_studio_now + 1)
            } else if (ctr_id_studio_now + 1 < 100) {
                new_id_studio = new_id_studio + "-0" + parseInt(ctr_id_studio_now + 1)
            } else if (ctr_id_studio_now + 1 >= 100) {
                new_id_studio = new_id_studio + "-" + parseInt(ctr_id_studio_now + 1)
            }
        }

        studio = await db.Studio.create({
            id_studio: new_id_studio,
            id_cabang: validationResult.id_cabang,
            nomor_studio: validationResult.nomor_studio,
            jenis_studio: validationResult.jenis_studio,
            baris: validationResult.baris,
            kolom: validationResult.kolom,
            id_bioskop: b.id_bioskop
        });

        return res.status(201).send({
            msg: "studio berhasil dibuat",
            id_studio: new_id_studio,
            id_cabang: validationResult.id_cabang,
            nomor_studio: validationResult.nomor_studio,
            jenis_studio: validationResult.jenis_studio,
            baris: validationResult.baris,
            kolom: validationResult.kolom,
            id_bioskop: b.id_bioskop
        });
    } catch (error) {
        return res.status(400).send(error.message)
    }


}


//ngecek studio valid nda
const checkValidId_Studio = async (id_studio) => {
    const c = await db.Studio.findOne({
        where: {
            id_studio: id_studio
        }
    })
    if (c) {
        return id_studio
    } else {
        throw new Error("id_studio invalid, studio tidak terdaftar")
    }
}

const registerJadwal = async (req, res) => {
    // var d = new Date,
    //     dformat = [d.getDate(), d.getMonth() + 1,
    //     d.getFullYear()].join('/') + ' ' +
    //         [d.getHours(),
    //         d.getMinutes(),
    //         d.getSeconds()].join(':');
    // console.log("ini waktu akses" + dformat)
    let api_key = req.header('x-auth-token')
    if (!api_key) {
        return res.status(403).send("unauthorized")
    }
    const u = await db.Bioskop.findOne({
        where: {
            api_key: api_key
        }
    })
    if (!u) {
        return res.status(404).send("api_key invalid, api_key tidak ditemukan")
    }

    const validator = Joi.object({
        id_bioskop: Joi.string()
            .external(checkValidId_Bioskop)
            .required()
            .label("Id Bioskop")
            .messages({
                "any.required": "{{#label}} harus ada",
                "string.empty": "{{#label}} tidak boleh blank"
            }),

        alamat: Joi.string()
            .required()
            .label("Alamat")
            .messages({
                "any.required": "{{#label}} harus diisi yaa",
                "string.empty": "{{#label}} tidak boleh blank",
            }),
    })
    try {
        const validationResult = await validator.validateAsync(req.body)
        const c = await db.Cabang.findAll()

        const b = await db.Bioskop.findOne({
            where: {
                id_bioskop: validationResult.id_bioskop
            }
        })

        let id_cabang = b.username;
        if (c.length + 1 < 10) {
            id_cabang = id_cabang + "00" + parseInt(c.length + 1)
        } else if (c.length + 1 < 100) {
            id_cabang = id_cabang + "0" + parseInt(c.length + 1)
        } else if (c.length + 1 >= 100) {
            id_cabang = id_cabang + parseInt(c.length + 1)
        }

        cabang = await db.Cabang.create({
            id_cabang: id_cabang,
            id_bioskop: validationResult.id_bioskop,
            alamat: validationResult.alamat
        });

        return res.status(201).send({
            msg: "cabang berhasil dibuat",
            id_cabang: id_cabang,
            id_bioskop: validationResult.id_bioskop,
            alamat: validationResult.alamat
        });

    } catch (error) {
        return res.status(400).send(error.message)
    }
}



module.exports = {
    registerCabang,
    registerStudio,
    registerJadwal
}
