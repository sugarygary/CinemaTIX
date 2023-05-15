"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("history", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_marketplace: {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "marketplace",
          key: "id_marketplace",
        },
      },
      id_tiket: {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "tiket",
          key: "id_tiket",
        },
      },
      id_jadwal: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("history");
  },
};
