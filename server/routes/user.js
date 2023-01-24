"use strict";

/**
 * Declaracion de dependencias
 */
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
    getAllUsers,
    authUser,
} = require('../../app/user');

/**
 * Declaracion de endpoints
 */
router.get('/',
    [],
    getAllUsers);
router.post('/auth',
    [
        body('email').isEmail().normalizeEmail(),
        body('pwd').not().isEmpty().trim().escape(),
    ],
    authUser);

/**
 * Exportacion de router
 */
module.exports = router;