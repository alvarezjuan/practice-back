"use strict";

/**
 * Declaracion de dependencias
 */
const {
  Model
} = require('sequelize');

/**
 * Declaracion de Modelo de Dominio
 */
module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    static associate(models) {
      Business.associate = function(models) {
        Business.hasMany(models.Product, {
          foreignKey: 'business_id'
        });
      };
    }
  }
  Business.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nit: {
      type: DataTypes.STRING,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING,
      unique: true
    },
    direccion: DataTypes.STRING,
    telefono: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Business',
    timestamps: false
  });
  return Business;
};