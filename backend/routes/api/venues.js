const express = require('express');
const { Op } = require('sequelize');
const { Event, Venue, Membership,Group } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { memberCheck } = require('../../utils/checks');
const router = express.Router();


router.put('/:venueId', requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const venueId = req.params.venueId
    const {address,lat,lng,city,state} = req.body
    const venFind = await Venue.findByPk(venueId)

    if(!venFind){
        const err = new Error("Venue couldn't be found")
        err.status = 404
       return next(err)
    }
    const membershipCheck = await Membership.findOne({where:{userId,groupId:venFind.groupId}})


    const groupFind = await Group.findByPk(venFind.groupId)
    if (groupFind){
    if (groupFind.organizerId === userId||membershipCheck.status === "co-host"){
        const venEdit = await venFind.update({
            address,
            city,
            state,
            lat,
            lng
        }, { defaultScope: true })
    const venReturn = {
        id:venEdit.id,
        groupId:venEdit.groupId,
        address:venEdit.address,
        city:venEdit.city,
        state:venEdit.state,
        lat:venEdit.lat,
        lng:venEdit.lng
    }
   const venueReturn = await venEdit.save()
   return res.json(venEdit)
    } else
   {
    const err = new Error("Forbidden")
    err.status = 403
  return next(err)
   }
}else{
    const err = new Error("Group couldn't be found")
    err.status = 404
   return next(err)
}})


module.exports = router;
