"use strict";

/**
 * Declaracion de dependencias
 */
const { validationResult } = require('express-validator');
var md5 = require('md5')
const User = require('../db').User;
var url = require('url');
var nJwt = require('njwt');
var secureRandom = require('secure-random');

var signingKey = secureRandom(256, { type: 'Buffer' }); // Create a highly random byte array of 256 bytes

/**
 * Exportacion en metodos publicos
 */
module.exports = {

    /**
     * get all users
     */
    getAllUsers: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        User.findAll({
            attributes: ['id', 'email', 'pwd', 'roles'],
            order: [['email', 'ASC']]
        }).then(users => {
            return res.status(200).json({
                users
            });
        }).catch(err => {
            return res.status(400).json({ errors: err.errors });
        });
    },

    /**
     * auth user
     */
    authUser: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let { email, pwd } = req.body;
        User.findOne({
            where: {
                email,
                pwd: md5(pwd)
            }
        }).then((user) => {
            if (user) {

                var fullUrl = url.format({
                    protocol: req.protocol,
                    host: req.get('host')
                });
                console.log(fullUrl);
                var claims = {
                    iss: fullUrl,
                    sub: user.email,
                    scope: user.roles
                };
                var jwt = nJwt.create(claims, signingKey);

                user.pwd = undefined;
                user.roles = JSON.parse(user.roles);
                return res.status(200).json({
                    "message": "User autenticado",
                    "token_type": "Bearer",
                    "access_token": jwt.compact(),
                    // "signingKey": signingKey.toString('base64'),
                    user
                })
            } else {
                return res.status(401).json({
                    "message": "User no encontrado"
                });
            }
        })
    },

};