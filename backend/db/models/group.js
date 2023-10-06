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
        as:'Organizer',
        foreignKey:'organizerId'
        })

      Group.belongsToMany(
          models.User,
          { through: models.Membership,
          foreignKey:'groupId',
          onDelete: 'Cascade',
          otherKey:'userId'}
        )
        Group.hasMany(
          models.Venue,{
            foreignKey:'groupId',
            onDelete: 'Cascade',
          }
        )
        Group.hasMany(
          models.Event,{
            foreignKey:'groupId',
            onDelete: 'Cascade',
          }
        )
        Group.hasMany(
          models.Image,{
            as:'GroupImages',
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
      validate: {
        len:{
        args:[1,60],
        msg:"Name must be 60 characters or less"
      },
      notNull:{
        args:[true],
        msg:"Name must be 60 characters or less"
      }
    }},
    about:{
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        len:{
        args:[50,99999],
        msg:"About must be 50 characters or more"
      },
      notNull:{
        args:[true],
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
      validate:{
        isIn:{
          args:[["true","True","false","False"]],
          msg:"Private must be a boolean"
        }
      }
    },
    city:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          args:[true],
          msg:"City is required"
        },
        notEmpty:{
          args:[true],
          msg:"City is required"
        }
      }
    },
    state:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          args:[true],
          msg:"State is required"
        },
        notEmpty:{
          args:[true],
          msg:"State is required"
        }
      }
    }
  }, {scopes: {
    count: function (groupId){
      return{
        include:[
        Membership.count({where:{groupId:id}})
      ]}
    }
  },
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
