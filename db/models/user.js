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
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    pwd: DataTypes.STRING,
    roles: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false
  });
  return User;
};