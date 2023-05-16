"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Studio extends Model {
    static associate(models) {
      this.belongsTo(models.Cabang, {
        foreignKey: "id_cabang",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.hasMany(models.Jadwal, {
        foreignKey: "id_studio",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Studio.init(
    {
      id_studio: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      nomor_studio: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jenis_studio: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      baris: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      kolom: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_bioskop: {
        type: DataTypes.STRING,
        allowNull: false,

      },
    },
    {
      sequelize,
      modelName: "Studio",
      tableName: "studio",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Studio;
};
