"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Jadwal extends Model {
    static associate(models) {
      this.belongsTo(models.Studio, {
        foreignKey: "id_studio",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.hasMany(models.Tiket, {
        foreignKey: "id_jadwal",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Jadwal.init(
    {
      id_jadwal: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      id_film: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      judul_film: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      durasi: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "in Minutes",
      },
      synopsis: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      age_rating: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      harga: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jadwal_tayang: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Jadwal",
      tableName: "jadwal",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Jadwal;
};
