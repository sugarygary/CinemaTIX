const { default: axios } = require("axios");
const db = require("../models");
const { Op } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));
const IMDB_API_KEY = "a636df9869msh090dff929636d90p1f4196jsnc1d1abb1880c";

const queryBioskop = async (req, res) => {
    let token = req.header('x-api-key');
    let {nama_bioskop} = req.query

    if(token != undefined){
        const search_user_api = await db.Marketplace.findOne({
            where: {
                api_key: {
                    [Op.eq]: token
                }
            }
        })

        if(!search_user_api){
            return res.status(400).send({message: "Incorrect api key"})
        }
        
        let temp = [];
        if(nama_bioskop && nama_bioskop.length > 1){
            const search_bioskop = await db.Bioskop.findOne({
                where: {
                    nama: {
                        [Op.like]: "%" + nama_bioskop + "%" 
                    }
                }
            });

            if(search_bioskop === null || search_bioskop.length === 0){
                return res.status(404).send({message: "Bioskop tidak terdaftar!!"})
            }

            let count_cabang = await db.Cabang.findAll({
                where: {
                    id_bioskop: {
                        [Op.eq]: search_bioskop.id_bioskop
                    }
                }
            })

            count_cabang = count_cabang.length;

            temp = {
                id: search_bioskop.id_bioskop,
                username: search_bioskop.username,
                nama: search_bioskop.nama,
                jumlah_cabang: count_cabang
            }
        }else{
            const list_bioskop = await db.Bioskop.findAll();
            for (let i = 0; i < list_bioskop.length; i++) {
                temp.push(list_bioskop[i].nama);                
            }
        }

        return res.status(200).send({
            data: temp
        })
    }

    return res.status(404).send({
        message: "Missing api key"
    })
}

const showCabang = async (req, res) => {
    let token = req.header('x-api-key');
    let {nama_bioskop} = req.query

    if(token != undefined){
        const search_user_api = await db.Marketplace.findOne({
            where: {
                api_key: {
                    [Op.eq]: token
                }
            }
        })

        if(!search_user_api){
            return res.status(400).send({message: "Incorrect api key"})
        }

        let search_bioskop;
        if(nama_bioskop && nama_bioskop.length > 1){
            search_bioskop = await db.Bioskop.findAll({
                where: {
                    nama: {
                        [Op.like]: "%" + nama_bioskop + "%"
                    }
                }
            })
        }else{
            search_bioskop = await db.Bioskop.findAll();
        }

        if(search_bioskop === null || search_bioskop.length === 0){
            return res.status(404).send({
                message: "Bioskop tidak terdaftar!!"
            })    
        }

        const temp = [];
        for (let i = 0; i < search_bioskop.length; i++) {
            const search_cabang = await db.Cabang.findAll({
                where: {
                    id_bioskop: {
                        [Op.eq]: search_bioskop[i].id_bioskop
                    }
                }
            })

            for (let j = 0; j < search_cabang.length; j++) {
                const data = {
                    id_cabang: search_cabang[j].id_cabang,
                    nama: search_cabang[j].nama
                }

                temp.push(data);
            }
        }

        if(temp.length === 0){
            return res.status(400).send({
                message: "Belum ada data bioskop"
            })    
        }

        return res.status(200).send({
            data: temp
        })
    }

    return res.status(404).send({
        message: "Missing api key"
    })
}

const showJadwal = async (req, res) => {
    
}

module.exports = {
    queryBioskop,
    showCabang
};