"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tiket", "barcode_key", {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      unique: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tiket", "barcode_key");
  },
};
