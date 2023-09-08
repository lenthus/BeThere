'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.belongsTo(
        models.User,{
        foreignKey:'organizerId'
        })

      Group.belongsToMany(
          models.User,
          {through:models.Group,
          foreignKey:'groupId',
          otherKey:'userId'}
        )
        Group.hasMany(
          models.Venue,{
            foreignKey:'groupId'
          }
        )
        Group.hasMany(
          models.Event,{
            foreignKey:'groupId'
          }
        )
    }
  }
  Group.init({
    organizerId:{
     type: DataTypes.INTEGER,
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false,
      validator: {
        len:[1,60]
      }
    },
    about:{
      type:DataTypes.STRING,
      allowNull:false,
      validator: {
        len:[1,50]
      }
    },
    type: DataTypes.STRING,
    private: DataTypes.BOOLEAN,
    city: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
