'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Venue.belongsTo(
        models.Group,{
          foreignKey:'groupId'
        }
      )
      Venue.hasMany(
        models.Event,{
          foreignKey:'venueId'
        }
      )
    }
  }
  Venue.init({
    groupId:{
    type:DataTypes.INTEGER,
    },
    address:{
    type:DataTypes.STRING,
    validate:{
      notEmpty:{
        args:true,
        msg:"Street address is required"
      }
    }
    },
    city:{
    type:DataTypes.STRING,
    validate:{
      notEmpty:{
        args:true,
        msg:"City is required"
      }
    }

    },
    state:{
    type:DataTypes.STRING,
    validate:{
      notEmpty:{
        args:true,
        msg:"State is required"
      }
    }
    },
    lat:{
    type:DataTypes.DECIMAL,
    validate:{
      isDecimal:{
        args:true,
        msg:"Latitude is not valid"
      },
      notEmpty:{
        args:true,
        msg:"Latitude is not valid"
      }
    }
    },
    lng:{
    type:DataTypes.DECIMAL,
    validate:{
      isDecimal:{
        args:true,
        msg:"Longitude is not valid"
      },
      notEmpty:{
        args:true,
        msg:"Longitude is not valid"
      }
    }
    },
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};