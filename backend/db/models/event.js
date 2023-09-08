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
      Event.hasOne(
        models.Venue,{
          foreignKey:'venueId'
        }
      )
      Event.belongsTo(
        models.Group,{
        foreignKey:'groupId'
        })
      Event.belongsToMany(
        models.User,{
          through:models.Attendee,
          foreignKey:'userId',
          otherKey:'eventId'
        }
      )
    }
  }
  Event.init({
    groupId: DataTypes.INTEGER,
    venueId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    startDate: DataTypes.STRING,
    endDate: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
