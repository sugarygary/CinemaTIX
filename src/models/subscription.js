"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    static associate(models) {
      this.belongsTo(models.WebReview, {
        foreignKey: "id_web_review",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Subscription.init(
    {
      id_subscription: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.STRING,
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
    },
    {
      sequelize,
      modelName: "Subscription",
      tableName: "subscription",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Subscription;
};
