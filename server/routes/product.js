"use strict";

/**
 * Declaracion de dependencias
 */
const express = require('express');
const { param, body } = require('express-validator');
const router = express.Router();
const {
    getAllProducts,
    getBusinessProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../../app/product');

/**
 * Declaracion de endpoints
 */
router.get('/',
    [],
    getAllProducts);
router.get('/forbusiness/:id',
    [
        param('id').isNumeric().toInt(),
    ],
    getBusinessProducts);
router.get('/:id',
    [
        param('id').isNumeric().toInt(),
    ],
    getProduct);
router.post('/forbusiness/:id',
    [
        param('id').isNumeric().toInt(),
        body('nombre').not().isEmpty().trim(),
    ],
    createProduct);
router.put('/:id',
    [
        param('id').isNumeric().toInt(),
        body('business_id').isNumeric().toInt(),
        body('nombre').not().isEmpty().trim(),
    ],
    updateProduct);
router.delete('/:id',
    [
        param('id').isNumeric().toInt(),
    ],
    deleteProduct);

/**
 * Exportacion de router
 */
module.exports = router;