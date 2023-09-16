'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.belongsTo(
        models.Venue,{
          foreignKey:'venueId'
        }
      )
      Event.belongsTo(
        models.Group,{
        foreignKey:'groupId',
        onDelete:'CASCADE'
      })
      Event.belongsToMany(
        models.User,{
          through:models.Attendee,
          foreignKey:'eventId',
          otherKey:'userId'
        }
      )
      Event.hasMany(
        models.Image,{
          foreignKey:"imageableId",
          constraints: false,
          scope: {
            imageType:"Event"
          }
        }
      )
    }
  }
  Event.init({
    groupId:{
    type:DataTypes.INTEGER,
    },
    venueId:{
    type:DataTypes.INTEGER,
    },
    name:{
    type:DataTypes.STRING,
    validate:{
      notEmpty:{
        args:true,
        msg:"Name must be at least 5 characters"
      }
    }
    },
    type:{
    type:DataTypes.STRING,
    validate:{
      isIn:{
        args:[['Online', 'In person']],
        msg:"Type must be Online or In person",
      }
    }
    },
    startDate:{
    type:DataTypes.DATE,
    validate: {
      customValidator(value) {
        if (new Date(value) < new Date()) {
          throw new Error("Start date must be in the future");
        }
      },
    },
    },
    endDate:{
    type:DataTypes.DATE,
    validate: {
      customValidator(value) {
        if (new Date(value) < new Date(this.startDate)) {
          throw new Error("End date is less than start date");
        }
      },
    },
    },
    capacity:{
    type:DataTypes.INTEGER,
    validate:{
      isInt:{
        msg:"Capacity must be an integer"
      }
    }
    },
    description:{
    type:DataTypes.STRING,
    validate:{
      notEmpty:{
        args:true,
        msg:"Description is required",
      }
    }
    },
    price:{
    type:DataTypes.DECIMAL,
    validate:{
      isDecimal:{

        msg:"Price is invalid"
      }
    }
    },
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
