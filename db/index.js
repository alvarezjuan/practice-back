'use strict';

/**
 * Declaracion de dependencias
 */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const basedirname = __dirname + '/models';
const config = require(basedirname + '/../../config/config.json')[env];
const db = {};

/**
 * Inicializacion de objeto de base de datos
 */
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(basedirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(basedirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

let warmUp = async function() {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  let seeder = require("./seeders/sample-data.js");
  await seeder.up(sequelize.getQueryInterface(), Sequelize);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.warmUp = warmUp;

module.exports = db;