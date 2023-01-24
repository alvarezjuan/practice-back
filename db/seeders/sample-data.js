'use strict';

/**
 * Declaracion de dependencias
 */
var md5 = require('md5')

/**
 * Declaracion de seed data
 */
const seedUsers = [
  { email: "admin@acme.org", pwd: md5('admin123456'), roles: "[\"admin\",\"user\"]" },
  { email: "user@acme.org", pwd: md5('user123456'), roles: "[\"user\"]" },
];

const seedBusiness = [
  { nit: "11111111", nombre: 'nombre 1', direccion: "direccion 1", telefono: "11111111" },
  { nit: "22222222", nombre: 'nombre 2', direccion: "direccion 2", telefono: "22222222" },
  { nit: "33333333", nombre: 'nombre 3', direccion: "direccion 3", telefono: "33333333" },
];

const seedProducts = [
  { business_id: 1, nombre: 'producto 1 1' },
  { business_id: 1, nombre: 'producto 1 2' },
  { business_id: 1, nombre: 'producto 1 3' },
  { business_id: 2, nombre: 'producto 2 1' },
  { business_id: 2, nombre: 'producto 2 2' },
  { business_id: 3, nombre: 'producto 3 1' },
];

/**
 * Exportacion en metodos publicos
 */
module.exports = {

  /**
   * Sample data creation
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', seedUsers);
    await queryInterface.bulkInsert('Businesses', seedBusiness);
    await queryInterface.bulkInsert('Products', seedProducts);
  },

  /**
   * Sample data deletion
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Businesses', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }

};
