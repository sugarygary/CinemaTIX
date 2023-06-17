"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    static associate(models) {
      this.belongsTo(models.Marketplace, {
        foreignKey: "id_marketplace",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.Tiket, {
        foreignKey: "id_tiket",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  History.init(
    {
      id_history: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_jadwal: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "History",
      tableName: "history",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return History;
};
