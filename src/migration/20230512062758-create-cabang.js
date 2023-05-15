"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cabang", {
      id_cabang: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      id_bioskop: {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "bioskop",
          key: "id_bioskop",
        },
      },
      alamat: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("cabang");
  },
};
