"use strict";

/**
 * Declaracion de dependencias
 */
const { validationResult } = require('express-validator');
const Product = require('../db').Product;

/**
 * Exportacion en metodos publicos
 */
module.exports = {

    /**
     * get all products
     */
    getAllProducts: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        Product.findAll({
            attributes: ['id', 'business_id', 'nombre'],
            order: [['business_id', 'ASC'], ['nombre', 'ASC']]
        }).then(products => {
            return res.status(200).json({
                products
            });
        }).catch(err => {
            return res.status(400).json({ errors: err.errors });
        });
    },

    /**
     * get business products
     */
    getBusinessProducts: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let { id } = req.params;

        Product.findAll({
            where: {
                business_id: id
            },
            attributes: ['id', 'business_id', 'nombre'],
            order: [['business_id', 'ASC'], ['nombre', 'ASC']]
        }).then(products => {
            return res.status(200).json({
                products
            });
        }).catch(err => {
            return res.status(400).json({ errors: err.errors });
        });
    },

    /**
     * get single product by id
     */
    getProduct: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let { id } = req.params;

        Product.findByPk(id)
            .then((product) => {
                if (product) {
                    return res.status(200).json({ product })
                } else {
                    return res.status(404).json({
                        "message": "Product no encontrado"
                    });
                }
            }).catch(err => {
                return res.status(400).json({ errors: err.errors })
            })
    },

    /**
     * create product by business_id
     */
    createProduct: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let { id } = req.params;
        let { nombre } = req.body;
        Product.create({
            business_id: id,
            nombre
        }).then((product) => {
            return res.status(201).json({
                "message": "Product creado",
                product
            })
        }).catch(err => {
            return res.status(400).json({ errors: err.errors });
        })
    },

    /**
     * update product by id
     */
    updateProduct: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let { id } = req.params;
        let { business_id, nombre } = req.body;

        Product.findOne({
            where: { id: id }
        }).then(product => {
            if (product) {
                product.update({ business_id, nombre })
                    .then((updateProduct) => {
                        return res.status(202).json({
                            "message": "Product actualizado",
                            updateProduct
                        });
                    });
            } else {
                return res.status(404).json({
                    "message": "Product no encontrado"
                });
            }
        }).catch(error => {
            return res.status(400).json({ error })
        })
    },


    /**
     * delete product by id
     */
    deleteProduct: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let { id } = req.params;

        Product.destroy({
            where: { id: id }
        }).then(() => {
            return res.status(200).json({
                "message": "Product eliminado"
            })
        }).catch(err => {
            return res.status(400).json({ error })
        })

    },

};