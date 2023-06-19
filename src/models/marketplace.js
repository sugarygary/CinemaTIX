"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Marketplace extends Model {
    static associate(models) {
      this.hasMany(models.History, {
        foreignKey: "id_marketplace",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Marketplace.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      api_key: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Marketplace",
      tableName: "marketplace",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Marketplace;
};
