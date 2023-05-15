"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bioskop extends Model {
    static associate(models) {
      this.hasMany(models.Cabang, {
        foreignKey: "id_bioskop",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Bioskop.init(
    {
      id_bioskop: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      api_key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Bioskop",
      tableName: "bioskop",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Bioskop;
};
