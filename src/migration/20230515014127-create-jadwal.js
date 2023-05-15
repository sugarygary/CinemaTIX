"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jadwal", {
      id_jadwal: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      id_studio: {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "studio",
          key: "id_studio",
        },
      },
      id_film: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      judul_film: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      durasi: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "in Minutes",
      },
      synopsis: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      age_rating: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      harga: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      jadwal_tayang: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("jadwal");
  },
};
