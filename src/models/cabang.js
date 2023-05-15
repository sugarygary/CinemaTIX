"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cabang extends Model {
    static associate(models) {
      this.belongsTo(models.Bioskop, {
        foreignKey: "id_bioskop",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.hasMany(models.Studio, {
        foreignKey: "id_cabang",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Cabang.init(
    {
      id_cabang: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      alamat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Cabang",
      tableName: "cabang",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Cabang;
};
