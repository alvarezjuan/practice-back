"use strict";

/**
 * Declaracion de dependencias
 */
const express = require('express');
const { param, body } = require('express-validator');
const router = express.Router();
const {
    getAllBusiness,
    getBusinessAndProducts,
    getBusinessAndProductsPdf,
    getBusiness,
    createBusiness,
    postBusinessAndProductsEmail,
    updateBusiness,
    deleteBusiness,
} = require('../../app/business');

/**
 * Declaracion de endpoints
 */
router.get('/',
    [],
    getAllBusiness);
router.get('/bap',
    [],
    getBusinessAndProducts);
router.get('/bap2pdf',
    [],
    getBusinessAndProductsPdf);
router.get('/:id',
    [
        param('id').isNumeric().toInt(),
    ],
    getBusiness);
router.post('/',
    [
        body('nit').not().isEmpty().isNumeric().trim(),
        body('nombre').not().isEmpty().trim(),
        body('direccion').not().isEmpty().trim(),
        body('telefono').not().isEmpty().isNumeric().trim(),
    ],
    createBusiness);
router.post('/bap2mail',
    [
        body('email').isEmail().normalizeEmail(),
    ],
    postBusinessAndProductsEmail);
router.put('/:id',
    [
        param('id').isNumeric().toInt(),
        body('nit').not().isEmpty().isNumeric().trim(),
        body('nombre').not().isEmpty().trim(),
        body('direccion').not().isEmpty().trim(),
        body('telefono').not().isEmpty().isNumeric().trim(),
    ],
    updateBusiness);
router.delete('/:id',
    [
        param('id').isNumeric().toInt(),
    ],
    deleteBusiness);

/**
 * Exportacion de router
 */
module.exports = router;