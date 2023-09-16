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
    const groupFind = await Group.findByPk(venFind.groupId)
    console.log(memberCheck(userId,venFind.groupId).status)

    if (groupFind){
    if (groupFind.organizerId === userId||memberCheck(userId,venFind.groupId).status === "co-host"){
    const venEdit = await venFind.set({
        address,
        city,
        state,
        lat,
        lng
    })
    const venReturn = {
        address:venEdit.address,
        city:venEdit.city,
        state:venEdit.state,
        lat:venEdit.lat,
        lng:venEdit.lng
    }
    await venEdit.save()
   return res.json(venReturn)} else
   {
    const err = new Error("Bad Request")
    err.status = 404
    next(err)
   }
}else{
    const err = new Error("Group couldn't be found")
    err.status = 404
    next(err)
}})


module.exports = router;
