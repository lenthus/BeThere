const express = require('express');
const { Op } = require('sequelize');
const { Event, Venue, Membership, Group } = require('../db/models');

//! Changed from FindAll
const memberCheck = async (userId,groupId) => {
    const check = await Membership.findOne({where:{
    userId,
    groupId,
}})
    return check
}
const superCheck = async (userId,groupId) =>{
    const checked = null

    const groupFind = await Group.findByPk(groupId)
    if ((memberCheck(userId,groupId)&&memberCheck(userId,groupId).status==="co-host")||groupFind.organizerId===userId){
        checked=true
    }
    return checked
}


module.exports = { memberCheck,superCheck };
