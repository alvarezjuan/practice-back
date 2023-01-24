"use strict";

/**
 * Declaracion de dependencias
 */
const { validationResult } = require('express-validator');
const { jsPDF } = require('jspdf')
require('jspdf-autotable')
const nodemailer = require("nodemailer");

const { QueryTypes } = require('sequelize');
const db = require('../db');
const Business = require('../db').Business;

/**
 * Genera PDF de tabla de datos
 */
function generarReporte(data) {
    const doc = new jsPDF();

    const tableColumn = ["Nit", "Nombre", "Dureccion", "Telefono", "Producto"];
    const tableRows = [];

    data.forEach(datum => {
        const tableRow = [
            datum.nit,
            datum.nombre,
            datum.direccion,
            datum.telefono,
            datum.product_nombre
        ];        // push each tickcet's info into a row
        tableRows.push(tableRow);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Empresas y Productos del inventario.", 14, 15);

    return doc.output();
}

/**
 * Envia un PDF a correo electronico
 */
async function enviarReporte(email, data) {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
    let info = await transporter.sendMail({
        from: '"Acme.org" <noname@arme.org>',
        to: email,
        subject: "Reporte De Inventario",
        text: "Se adjunta reporte de inventario solicitado en el sistema",
        html: "<b>Se adjunta reporte de inventario solicitado en el sistema</b>",
        attachments: [
            {
                filename: 'Reporte.pdf',
                content: data
            }
        ]
    });
    return nodemailer.getTestMessageUrl(info);
}

/**
 * Exportacion en metodos publicos
 */
module.exports = {

    /**
     * get all business
     */
    getAllBusiness: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        Business.findAll({
            attributes: ['id', 'nit', 'nombre', 'direccion', 'telefono'],
            order: [['nit', 'ASC']]
        }).then(business => {
            return res.status(200).json({
                business
            });
        }).catch(err => {
            return res.status(400).json({ errors: err.errors });
        });
    },

    /**
     * get business and products data
     */
    getBusinessAndProducts: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        db.sequelize.query("select Businesses.nit, Businesses.nombre, Businesses.direccion, Businesses.telefono, Products.nombre as product_nombre from Businesses join Products on Businesses.id = Products.business_id", { type: QueryTypes.SELECT })
            .then(business => {
                return res.status(200).json({
                    business
                });
            }).catch(err => {
                return res.status(400).json({ errors: err.errors });
            });
    },

    /**
     * get business and products pdf
     */
    getBusinessAndProductsPdf: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        db.sequelize.query("select Businesses.nit, Businesses.nombre, Businesses.direccion, Businesses.telefono, Products.nombre as product_nombre from Businesses join Products on Businesses.id = Products.business_id", { type: QueryTypes.SELECT })
            .then(business => {
                let contenidoPdf = generarReporte(business)
                return res.status(200).json(contenidoPdf);
            }).catch(err => {
                return res.status(400).json({ errors: err.errors });
            });
    },

    /**
     * get single business by id
     */
    getBusiness: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let { id } = req.params;

        Business.findByPk(id)
            .then((business) => {
                if (business) {
                    return res.status(200).json({ business })
                } else {
                    return res.status(404).json({
                        "message": "Business no encontrado"
                    });
                }
            }).catch(err => {
                console.log(err);
                return res.status(400).json({ errors: err.errors })
            })
    },

    /**
     * create business
     */
    createBusiness: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let { nit, nombre, direccion, telefono } = req.body;
        Business.create({
            nit,
            nombre,
            direccion,
            telefono
        }).then((business) => {
            return res.status(201).json({
                "message": "Business creado",
                business
            })
        }).catch(err => {
            return res.status(400).json({ errors: err.errors });
        })
    },

    /**
     * post business and products email
     */
    postBusinessAndProductsEmail: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let { email } = req.body;
        db.sequelize.query("select Businesses.nit, Businesses.nombre, Businesses.direccion, Businesses.telefono, Products.nombre as product_nombre from Businesses join Products on Businesses.id = Products.business_id", { type: QueryTypes.SELECT })
            .then(business => {
                let contenidoPdf = generarReporte(business)
                enviarReporte(email, contenidoPdf)
                    .then(url => {
                        res.status(200).json(url)
                    });
            }).catch(err => {
                return res.status(400).json({ errors: err.errors });
            });
    },

    /**
     * update business by id
     */
    updateBusiness: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let { id } = req.params;
        let { nit, nombre, direccion, telefono } = req.body;

        Business.findOne({
            where: { id: id }
        }).then(business => {
            if (business) {
                business.update({ nit, nombre, direccion, telefono })
                    .then((updateBusiness) => {
                        return res.status(202).json({
                            "message": "Business actualizado",
                            updateBusiness
                        });
                    });
            } else {
                return res.status(404).json({
                    "message": "Business no encontrado"
                });
            }
        }).catch(error => {
            return res.status(400).json({ errors: err.errors });
        })
    },


    /**
     * delete business by id
     */
    deleteBusiness: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let { id } = req.params;

        Business.destroy({
            where: { id: id }
        }).then(() => {
            return res.status(204).json({
                "message": "Business eliminado"
            })
        }).catch(err => {
            return res.status(400).json({ error })
        })

    },

};