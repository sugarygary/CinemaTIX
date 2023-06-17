"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("history", "id", "id_history");
    await queryInterface.changeColumn("history", "id_history", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("history", "id_history", {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
    });
    await queryInterface.renameColumn("history", "id_history", "id");
  },
};
