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
          { through: models.Membership,
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
        Group.hasMany(
          models.Image,{
            foreignKey:"imageableId",
            constraints: false,
            scope: {
              imageType:"Group"
            }
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
        len:{
        args:[[1,60]],
        msg:"Name must be 60 characters or less"
      }
    }},
    about:{
      type:DataTypes.STRING,
      allowNull:false,
      validator: {
        len:{
        args:[[1,50]],
        msg:"About must be 50 characters or more"
      }
    }},
    type:{
      type:DataTypes.ENUM('Online','In person'),
      validate:{
        isIn:{
          args:[['Online','In person']],
          msg:"Type must be 'Online' or 'In person'"
        }
        }
      },
    private:{
      type:DataTypes.BOOLEAN,
    },
    city:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          args:true,
          msg:"City is required"
        }
      }
    },
    state:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          args:true,
          msg:"State is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
