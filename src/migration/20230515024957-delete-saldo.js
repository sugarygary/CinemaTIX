"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("bioskop", "saldo");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("bioskop", "saldo", {
      type: Sequelize.DataTypes.INTEGER,
    });
  },
};
