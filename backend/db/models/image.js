'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    getImageable(options) {
      if (!this.imageType) return Promise.resolve(null);
      const mixinMethodName = `get${this.imageType}`;
      return this[mixinMethodName](options);
    }

    static associate(models) {
      Image.belongsTo(models.Event, {
        foreignKey: 'imageableId',
        constraints: false
      });
      Image.belongsTo(models.Group, {
        as:'GroupImages',
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
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Image;
};
