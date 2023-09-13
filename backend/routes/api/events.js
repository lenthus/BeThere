const express = require('express');
const { Op } = require('sequelize');
const {Event, Venue, Membership, Group, Image, Attendee} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { memberCheck, superCheck } = require('../../utils/checks');
const router = express.Router();

router.get('/', async(req,res)=>{
    const getAllEvents = await Event.findAll({
        include:[
            {model:Group},
            {model:Venue},
        ]
    })
    const evReturn = []
    for (const event of getAllEvents){
        let img = null
        const numMembers = await Attendee.count({where:{eventId:event.id}})
        const imageGetter = await Image.findOne({where:{imageableId:event.id,preview:true,imageType:"Event"}})
        if (imageGetter){
        img = imageGetter.url
        } else{
        img = null}
        const evenReturn = {
            id:event.id,
            groupId:event.groupId,
            venueId:event.venueId,
            name:event.name,
            type:event.type,
            startDate:event.startDate,
            endDate:event.endDate,
            numAttending:numMembers,
            previewImage:img,
            Group:{
                id:event.Group.id,
            name:event.Group.name,
            city:event.Group.city,
            state:event.Group.state},
            Venue:{
                id:event.Venue.id,
                city:event.Venue.city,
                state:event.Venue.state
            }

        }
        evReturn.push(evenReturn)
    }
    return res.json(evReturn)
})
router.post('/:eventId/images', requireAuth, async(req, res,next)=>{
    const {eventId} = req.params.eventId
    const userId = req.user.id
    const {url, preview} = req.body

    const eventCheck = await Event.findByPk(eventId)
    const getAttendee = await Attendee.findOne({where:{userId}})
    if (eventCheck){

    if (getAttendee){
    const imgCreate = await eventCheck.createImage({
    url,
    preview,
    imageType: 'Event'
    })

    const imgReturn = {
        id:imgCreate.id,
        url:imgCreate.url,
        preview:imgCreate.preview
    }
    return res.json(imgCreate)
}
    else{
        const err = new Error("Event couldn't be found")
        err.status = 404
        next(err)
    }
}else{
    const err = new Error("Event couldn't be found")
    err.status = 404
    next(err)
}})
router.get('/:eventId', async(req, res, next)=>{
    const eventId = req.params.eventId
    const event = await Event.findOne({where:{id:eventId},
        include:[
            {model:Group},
            {model:Venue},
        ]
    })
        let img = null
        const numMembers = await Attendee.count({where:{eventId:event.id}})
        const imageGetter = await Image.findOne({where:{imageableId:event.id,preview:true,imageType:"Event"}})
        if (imageGetter){
        img = imageGetter.url
        } else{
        img = null}
        const evenReturn = {
            id:event.id,
            groupId:event.groupId,
            venueId:event.venueId,
            name:event.name,
            type:event.type,
            startDate:event.startDate,
            endDate:event.endDate,
            numAttending:numMembers,
            previewImage:img,
            Group:{
                id:event.Group.id,
            name:event.Group.name,
            city:event.Group.city,
            state:event.Group.state},
            Venue:{
                id:event.Venue.id,
                city:event.Venue.city,
                state:event.Venue.state
            }

        }


    return res.json(evenReturn)
})


module.exports = router;
