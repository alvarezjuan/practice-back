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
  class Product extends Model {
    static associate(models) {
      Product.associate = function(models) {
        Product.belongsTo(models.Business, {
          foreignKey: 'id'
        });
      };
    }
  }
  Product.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    business_id: {
      type: DataTypes.INTEGER,
      unique: 'unique-key'
    },
    nombre: {
      type: DataTypes.STRING,
      unique: 'unique-key'
    }
  }, {
    sequelize,
    modelName: 'Product',
    timestamps: false
  });
  return Product;
};