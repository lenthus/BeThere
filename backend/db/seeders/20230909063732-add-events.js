// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add seed commands here.
//      *
//      * Example:
//      * await queryInterface.bulkInsert('People', [{
//      *   name: 'John Doe',
//      *   isBetaMember: false
//      * }], {});
//     */
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
//   }
// };

'use strict';
const { Event, Group } = require('../models')

const newEvents = [
  {
    name: "Evening Tennis on the Water",
    event: [{
      "venueId": 2,
      "name": "Tennis Group First Meet and Greet",
      "type": "Online",
      "capacity": 10,
      "price": 18.50,
      "description": "The first meet and greet for our group! Come say hello!",
      "startDate": "2023-11-19 20:00:00",
      "endDate": "2023-11-19 22:00:00",
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


        for (const ven of event) {
          await Event.create({...ven, groupId: groupEvent.id})
        }

      }
  },

  async down (queryInterface, Sequelize) {
    for (const gEvent of newEvents){
      const {name, event} = gEvent
      const groupEvent = await Group.findOne({where: { name }})
      console.log(groupEvent)


      for (const ven of event) {
        await Event.destroy({ where: {...ven, groupId: groupEvent.id}})
      }

    }
  }
};
