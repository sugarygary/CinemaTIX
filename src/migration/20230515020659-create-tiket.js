"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tiket", {
      id_tiket: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      id_jadwal: {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "jadwal",
          key: "id_jadwal",
        },
      },
      nomor_kursi: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "0:AVAILABLE;1:BOUGHT",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tiket");
  },
};
