"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WebReview extends Model {
    static associate(models) {
    //   this.belongsTo(models.Cabang, {
    //     foreignKey: "id_cabang",
    //     onDelete: "CASCADE",
    //     onUpdate: "CASCADE",
    //   });
    //   this.hasMany(models.Jadwal, {
    //     foreignKey: "id_studio",
    //     onDelete: "CASCADE",
    //     onUpdate: "CASCADE",
    //   });
    }
  }
  WebReview.init(
    {
      id_web_review: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      nama_web_review: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      api_key: {
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
      modelName: "WebReview",
      tableName: "webreview",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return WebReview;
};
