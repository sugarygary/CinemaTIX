"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("studio", {
      id_studio: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      id_cabang: {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "cabang",
          key: "id_cabang",
        },
      },
      nomor_studio: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      jenis_studio: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      baris: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      kolom: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("studio");
  },
};
