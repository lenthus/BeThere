'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {

    static associate(models) {
      Image.belongsTo(models.Event, {
        foreignKey: 'imageableId',
        constraints: false
      });
      Image.belongsTo(models.Group, {
        foreignKey: 'imageableId',
        constraints: false
      });
    }
  }
  Image.init({
    url: DataTypes.STRING,
    imageType: DataTypes.ENUM("Event","Group"),
    imageableId: DataTypes.INTEGER,
    preview: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
