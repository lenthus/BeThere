'use strict';
const { Venue, Group } = require('../models')

const newVenues = [
  {
    name: "Evening Tennis on the Water",
    venue: [{
        "address": "123 Disney Lane",
        "city": "New York",
        "state": "NY",
        "lat": 37.7645358,
        "lng": -122.4730327,
    }]
}
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
      for (const group of newVenues){
        const {name, venue} = group
        const groupVenue = await Group.findOne({where: { name }})
        console.log(groupVenue)


        for (const ven of venue) {
          await Venue.create({...ven, groupId: groupVenue.id})
        }

      }
  },

  async down (queryInterface, Sequelize) {
    for (const group of newVenues){
      const {name, venue} = group
      const groupVenue = await Group.findOne({where: { name }})
      console.log(groupVenue)


      for (const ven of venue) {
        await Venue.destroy({where: {...ven, groupId: groupVenue.id }})
      }

    }
  }
};
