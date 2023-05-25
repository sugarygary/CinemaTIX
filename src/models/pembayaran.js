"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pembayaran extends Model {
    
  }
  Pembayaran.init(
    {
        id_pembayaran: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
          },
          bukti_pembayaran: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          tanggal_pembayaran: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          status: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          username: {
            type: DataTypes.STRING,
            allowNull: false,
          },
    },
    {
      sequelize,
      modelName: "Pembayaran",
      tableName: "pembayaran",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Pembayaran;
};