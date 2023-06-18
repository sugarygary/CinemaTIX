"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("history", "status", {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      comment: "0:PENDING;1:ACCEPTED;2:REJECTED",
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("history", "status");
  },
};
