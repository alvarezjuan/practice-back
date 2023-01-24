"use strict";

/**
 * Declaracion de dependencias
 */
const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const db = require('../db');

const app = express();
const bodyParser = require("body-parser");

module.exports = {

    buildApi: async () => {

        /**
         * Inicializacion de la base de datos
         */
        await db.warmUp();

        /**
         * Configuracion de  middleware
         */
        app.use(morgan('dev'));
        app.use(cors({ origin: '*' }));
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        app.options("*", (req, res, next) => {
            res.header('Access-Control-Allow-Origin', "*");
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Authorization, Content-Length, X-Requested-With');
            res.send(200);
        });
        app.use(express.json());

        /**
         * Procesamiento de archivos estaticos
         */
        app.use(express.static(path.join(__dirname, "../public")));

        /**
         * Procesamiento de peticiones al api
         */
        app.use("/api/users", require('./routes/user'));
        app.use("/api/business", require('./routes/business'));
        app.use("/api/products", require('./routes/product'));

        return app;

    }

};