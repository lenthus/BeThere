'use strict';

const { User, Group } = require('../models')


const newUserGroup = [
  {
    userName: 'Demo-lition',
    group:[ {
      "name": "Evening Tennis on the Water",
      "about": "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
      "type": "In person",
      "private": true,
      "city": "New York",
      "state": "NY",
    }]
  }
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for (const users of newUserGroup){
      const {userName, group} = users
      const userGroup = await User.findOne({where: { userName }})
      console.log(userGroup)


      for (const newGroup of group) {
        await Group.create({...newGroup, organizerId: userGroup.id})
      }

    }

    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    for (const users of newUserGroup){
      const {userName, group} = users
      const userGroup = await User.findOne({where: { userName }})


      for (const newGroup of group) {
        await Group.destroy({ where: {...newGroup, organizerId: userGroup.id}})
      }

    }
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
