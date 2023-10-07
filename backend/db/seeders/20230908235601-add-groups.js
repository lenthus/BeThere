'use strict';

const { User, Group, Membership } = require('../models')
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const newUserGroup = [
  {
    username: 'Demo-lition',
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
      const {username, group} = users
      const userGroup = await User.findOne({where: { username }})


      for (const newGroup of group) {
        const groupMake = await Group.create({...newGroup, organizerId: userGroup.id})
      }
    }
    const userGroup = await User.findOne({where: { username:'Demo-lition' }})
    const groupFind = await Group.findOne({where:{name:"Evening Tennis on the Water"}})
    // const memberMake = await Membership.create( {userId:userGroup.id,groupId:groupFind.id,status:"co-host"})

  },

  async down (queryInterface, Sequelize) {
    for (const users of newUserGroup){
      const {username, group} = users
      const userGroup = await User.findOne({where: { username }})


      for (const newGroup of group) {
        // const memberMake = await Membership.destroy({where: {userId:userGroup.id}})
        await Group.destroy({ where: {...newGroup, organizerId: userGroup.id}})

      }
    }
  }
};
