"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("bioskop", "password", {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn("marketplace", "password", {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn("webreview", "password", {
      type: Sequelize.TEXT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("bioskop", "password", {
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn("marketplace", "password", {
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn("webreview", "password", {
      type: Sequelize.STRING,
    });
  },
};
