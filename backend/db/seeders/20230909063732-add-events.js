
'use strict';
const { Event, Group, Venue } = require('../models')

const newEvents = [
  {
    name: "Evening Tennis on the Water",
    event: [{

      "name": "Tennis Group First Meet and Greet",
      "type": "Online",
      "capacity": 10,
      "price": 18.50,
      "description": "The first meet and greet for our group! Come say hello!",
      "startDate": "2023-12-19 20:00:00",
      "endDate": "2023-12-19 22:00:00",
    }]
}
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
      for (const gEvent of newEvents){
        const {name, event} = gEvent
        const groupEvent = await Group.findOne({where: { name }})
        console.log(groupEvent)
        const groupVen = await Venue.findOne({where: { address:"123 Disney Lane", }})

        for (const ven of event) {
          await Event.create({...ven,venueId:groupVen.id, groupId: groupEvent.id})
        }

      }
  },

  async down (queryInterface, Sequelize) {
    for (const gEvent of newEvents){
      const {name, event} = gEvent
      const groupEvent = await Group.findOne({where: { name }})



      for (const ven of event) {
        await Event.destroy({ where: {...ven, groupId:groupEvent.id}})
      }

    }
  }
};
