const { response } = require("express");
const fs = require("fs");
const express = require("express");
const db = require("../models");
const { Op } = require("sequelize");
const { all } = require("axios");
const Joi = require("joi").extend(require("@joi/date"));
const multer = require("multer");

const queryBioskop = async (req, res) => {
    const validator = Joi.object({
        nama_bioskop: Joi.string()
    });
    let token = req.header('x-api-key');
    const validationResult = await validator.validateAsync(req.body);

    if (token != undefined) {
        const webReview = await db.WebReview.findOne({
            where: {
                api_key: token,
            },
        });

        const cekBayar = await db.Pembayaran.findOne({
            where: {
                status: "Paid",
                bukti_pembayaran: webReview.username
            },
        });

        if (cekBayar != null) {
            let tmp = cekBayar.tanggal_pembayaran;
            let bulan = tmp.substr(5, 2);
            let tanggal = tmp.substr(8, 2);
            let today = new Date();
            var month = today.getMonth()+1;
            var date = today.getDate();
            if ((parseInt(month) == parseInt(bulan) && parseInt(date) > parseInt(tanggal)) || (parseInt(month) > parseInt(bulan) && parseInt(date) <= parseInt(tanggal)) || ((parseInt(month) == parseInt(bulan) && parseInt(date) == parseInt(tanggal)))) {
                if (webReview != null) {
                    if (validationResult.nama_bioskop != null) {
                        const idBioskop = await db.Bioskop.findOne({
                            where: {
                                nama: validationResult.nama_bioskop,
                            },
                        });
                
                        if (idBioskop != null) {
                            let cabang = await db.Cabang.findAll({
                                where: {
                                    id_bioskop: idBioskop.id_bioskop,
                                },
                            });
                            return res.status(200).send({
                                cabang,
                            });
                        } else {
                            return res.status(404).send({
                                msg: "bioskop tidak terdaftar",
                            });
                        }
                    } else {
                        let tmp;
                        let bioskop = [];
                        let allBioskop = await db.Bioskop.findAll();
                
                        for (let i = 0; i < allBioskop.length; i++) {
                            let cabang = await db.Cabang.findAll({
                                where: {
                                    id_bioskop: allBioskop[i].id_bioskop,
                                },
                            });
                            let tmpBioskop = [];
                            let tmpCabang;
                
                            for (let j = 0; j < cabang.length; j++) {
                                tmpCabang = {
                                    id_cabang : cabang[j].id_cabang,
                                    nama : cabang[j].nama,
                                }  
                                tmpBioskop.push(tmpCabang);      
                            }  
                            tmp = {
                                bioskop : allBioskop[i].nama,
                                cabang : tmpBioskop
                            }
                            bioskop.push(tmp);
                        }
                        return res.status(200).send({
                            bioskop,
                            });
                    } 
                } else {
                    return res.status(400).send({
                        "msg" : "invalid api key"
                        });
                }   
            } else {
                return res.status(400).send({
                    "msg" : "anda belum melakukan pembayaran"
                    });
            }
        } else {
            return res.status(400).send({
                "msg" : "pembayaran anda belum disetujui"
                });
        }
    } else {
        return res.status(400).send({
            "msg" : "api key required"
            });
    }
};

const showJadwal = async (req, res) => {
    const validator = Joi.object({
        movie_id: Joi.string().required(),
        id_bioskop : Joi.string()
    });
    let token = req.header('x-api-key');
    const validationResult = await validator.validateAsync(req.params);

    const cekToken = await db.WebReview.findOne({
        where: {
            api_key: token,
        },
    });
 
    const cekBayar = await db.Pembayaran.findOne({
        where: {
            status: "Paid",
            bukti_pembayaran: cekToken.username
        },
    });

    if (cekBayar != null) {
        let tmp = cekBayar.tanggal_pembayaran;
        let bulan = tmp.substr(5, 2);
        let tanggal = tmp.substr(8, 2);
        let today = new Date();
        var month = today.getMonth()+1;
        var date = today.getDate();
        if ((parseInt(month) == parseInt(bulan) && parseInt(date) > parseInt(tanggal)) || (parseInt(month) > parseInt(bulan) && parseInt(date) <= parseInt(tanggal)) || ((parseInt(month) == parseInt(bulan) && parseInt(date) == parseInt(tanggal)))) {
            if (token != undefined) {
                if (cekToken != null) {
                    if (validationResult.id_bioskop != undefined) {
                        let bioskop = await db.Bioskop.findOne({
                            where: {
                                id_bioskop: validationResult.id_bioskop,
                            },
                        });
                
                        if (bioskop != null) {
                            let jadwal = await db.Jadwal.findAll({
                                where: {
                                    id_film: validationResult.movie_id,
                                },
                            });
                
                            let tmpCabang;
                            let result = [];
                            if (jadwal.length > 0) {
                                for (let i = 0; i < jadwal.length; i++) {
                                    let allStudio = await db.Studio.findAll({
                                        where: {
                                            id_bioskop: validationResult.id_bioskop,
                                        },
                                    });
                
                                    for (let j = 0; j < allStudio.length; j++) {
                                        if (jadwal[i].id_studio == allStudio[j].id_studio) {
                                            let cabang = await db.Cabang.findAll({
                                                where: {
                                                    id_cabang: allStudio[j].id_cabang,
                                                },
                                            });
                
                                            for (let k = 0; k < cabang.length; k++) {
                                                tmpCabang = {
                                                    nama : cabang[k].nama,
                                                    alamat : cabang[k].alamat
                                                }
                
                                                result.push(tmpCabang);
                                            }
                                        }
                                    }
                                }
                
                                if (result.length > 0) {
                                    return res.status(200).send({
                                        result,
                                    });
                                } else {
                                    return res.status(404).send({
                                        msg : "Film tidak tayang pada bioskop ini"
                                    });
                                }
                            } else {
                                return res.status(404).send({
                                    msg : "Film tidak tayang pada bioskop ini"
                                });
                            }
                        } else {
                            return res.status(404).send({
                                msg: "bioskop tidak terdaftar",
                            });
                        }
                    } else {
                        let jadwal = await db.Jadwal.findAll({
                            where: {
                                id_film: validationResult.movie_id,
                            },
                        });
                
                        let tmp;
                        let tmpBioskop;
                        let resultCabang = [];
                        let result = [];
                
                        for (let i = 0; i < jadwal.length; i++) {
                            studio = await db.Studio.findAll({
                                where: {
                                    id_studio: jadwal[i].id_studio,
                                },
                            });
                
                            for (let j = 0; j < studio.length; j++) {
                                let cabang = await db.Cabang.findAll({
                                    where: {
                                        id_cabang: studio[j].id_cabang,
                                    },
                                });
                
                                for (let k = 0; k < cabang.length; k++) {
                                    tmp = {
                                        nama : cabang[k].nama,
                                        alamat : cabang[k].alamat
                                    }
                                    result.push(tmp);
                                }
                            }
                        }
                        return res.status(404).send({
                            result,
                        });
                    }
                } else {
                    return res.status(400).send({
                        "msg" : "invalid api key"
                        });
                }
            } else {
                return res.status(400).send({
                    "msg" : "api key required"
                    });
            }
        } else {
            return res.status(400).send({
                "msg" : "anda belum melakukan pembayaran"
                });
        }
    } else {
        return res.status(400).send({
            "msg" : "pembayaran anda belum disetujui"
            });
    }
};

const pembayaran = async (req, res) => {
    let today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    
    const validator = Joi.object({
        username: Joi.string().required()
    });

    let token = req.header('x-api-key');
    let pembayaran = null;

    const cekToken = await db.WebReview.findOne({
        where: {
            api_key: token,
        },
    });

    try {
        const validationResult = await validator.validateAsync(req.body);
        const cekUsername = await db.WebReview.findOne({
            where: { 
                username: validationResult.username,
            },
        });
        
        let temp = req.file.originalname;
        let filename = validationResult.username;
        if (token != undefined) {
            if (cekToken != null) {
                const cekPembyaran = await db.Pembayaran.findOne({
                    where: {
                        bukti_pembayaran: filename,
                    },
                });

                if (cekPembyaran == null) { 
                    if (cekUsername != null) {
                        pembayaran = await db.Pembayaran.create({
                            id_pembayaran: '',
                            bukti_pembayaran: filename,
                            tanggal_pembayaran: dateTime, 
                            status: "pending",
                            username: validationResult.username,
                        });
    
                        return res.status(200).send({
                            "msg" : "Berhasil melakukan pembayaran"
                            });
                    } else {
                        return res.status(400).send({
                            "msg" : "username salah"
                            });
                    }
                } else {
                    return res.status(400).send({
                        "msg" : "anda sudah melakukan pembayaran"
                        });
                } 
            } else {
                return res.status(400).send({
                    "msg" : "invalid api key"
                    });
            }
        } else {
            return res.status(400).send({
                "msg" : "api key required"
                });
        } 
    } catch (error) {
        return res.status(400).send({
            "msg" : "masukkan bukti pembayaran berupa foto"
        });
    }
};

const nowShowing = async (req, res) => {
    let token = req.header('x-api-key');

    const cekToken = await db.WebReview.findOne({
        where: {
            api_key: token,
        },
    });
 
    const cekBayar = await db.Pembayaran.findOne({
        where: {
            status: "Paid",
            bukti_pembayaran: cekToken.username
        },
    });

    if (cekBayar != null) {
        let tmp = cekBayar.tanggal_pembayaran;
        let bulan = tmp.substr(5, 2);
        let tanggal = tmp.substr(8, 2);
        let today = new Date();
        var month = today.getMonth()+1;
        var date = today.getDate();
        if ((parseInt(month) == parseInt(bulan) && parseInt(date) > parseInt(tanggal)) || (parseInt(month) > parseInt(bulan) && parseInt(date) <= parseInt(tanggal)) || ((parseInt(month) == parseInt(bulan) && parseInt(date) == parseInt(tanggal)))) {
            if (token != undefined) {
                if (cekToken != null) {
                    
                } else {
                    return res.status(400).send({
                        "msg" : "invalid api key"
                        });
                }
            } else {
                return res.status(400).send({
                    "msg" : "api key required"
                    });
            }
        } else {
            return res.status(400).send({
                "msg" : "anda belum melakukan pembayaran"
                });
        }
    } else {
        return res.status(400).send({
            "msg" : "pembayaran anda belum disetujui"
            });
    }
};

module.exports = {
    queryBioskop,
    showJadwal,
    pembayaran,
    nowShowing
  };