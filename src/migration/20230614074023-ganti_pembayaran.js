"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable("pembayaran", "subscription");
    await queryInterface.renameColumn(
      "subscription",
      "id_pembayaran",
      "id_subscription"
    );
    await queryInterface.removeColumn("subscription", "username");
    await queryInterface.addColumn("subscription", "id_web_review", {
      type: Sequelize.STRING,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      references: {
        model: "webreview",
        key: "id_web_review",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("subscription", "id_web_review");
    await queryInterface.addColumn("subscription", "username", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.renameColumn(
      "subscription",
      "id_subscription",
      "id_pembayaran"
    );
    await queryInterface.renameTable("subscription", "pembayaran");
  },
};
