"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tiket extends Model {
    static associate(models) {
      this.belongsTo(models.Jadwal, {
        foreignKey: "id_jadwal",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Tiket.init(
    {
      id_tiket: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      nomor_kursi: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Tiket",
      tableName: "tiket",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Tiket;
};
