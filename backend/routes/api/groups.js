const express = require('express');
const { Op } = require('sequelize');
const { Event, Group, Image, Membership,User,Venue,Attendee} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.get('/', async(req,res)=>{
    const getAllGroups = await Group.findAll({
        // include:[{
        //     model:Image,
        //     where:{preview:true}
        // }]
    })
   const groupsReturn = []
   let img = null
   for (const group of getAllGroups){
    //get image preview
    const imageGetter = await Image.findOne({where:{imageableId:group.id,preview:true}})
    if (imageGetter){
    img = imageGetter.url
    } else{
    img = null
    }
    //get numMembers
    const members = await Membership.count({where:{groupId:group.id}})
    const newGroup = {
        id:group.id,
        organizerId:group.organizerId,
        name:group.name,
        about:group.about,
        type:group.type,
        private:group.private,
        city:group.city,
        state:group.state,
        createdAt:group.createdAt,
        updatedAt:group.updatedAt,
        numMembers:members,
        previewImage:img
    }
    groupsReturn.push(newGroup)
   }

    return res.json(groupsReturn)
})

router.get('/current', requireAuth, async(req,res,next)=>{
    const userId = req.user.id

    const getUserGroups = await Group.findAll({
        where:{
            organizerId:userId
        },
        include:[
            {model:Image}
        ]
    })
    return res.json(getUserGroups)
})

router.get('/:groupId', async(req,res,next)=>{
    const groupId = req.params.groupId

    const getGroups = await Group.findOne({
        where:{ Id:groupId },
        include: [
            {model:Image},
            {model:User}
        ]
    })

    if (!getGroups) {
    const err = new Error("Group couldn't be found")
    err.status = 404
    next(err)
}else{

    return res.json(getGroups)
}})

router.post('/',requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const {name,about,type,private,city,state} = req.body

    const groupCreate = await Group.create({
        name,
        about,
        type,
        private,
        city,
        state,
        organizerId:userId
    })
   return res.json(groupCreate)

})

router.post('/:groupId/images',requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const groupId = req.params.groupId
    const {url, preview} = req.body

    const groupCheck = await Group.findByPk(groupId)
    if (groupCheck){

    if (groupCheck.organizerId === userId){
    const imgCreate = await groupCheck.createImage({
    url,
    preview,
    imageType: 'Group'
    })

    const imgReturn = {
        id:imgCreate.id,
        url:imgCreate.url,
        preview:imgCreate.preview
    }
    return res.json(imgReturn)
}
    else{
        const err = new Error("Group couldn't be found")
        err.status = 404
        next(err)
    }
}else{
    const err = new Error("Group couldn't be found")
    err.status = 404
    next(err)
}})

router.put('/:groupId', requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const groupId = req.params.groupId
    const {name,about,type,private,city,state} = req.body

    const groupFind = await Group.findByPk(groupId)
    if (groupFind){
    if (groupFind.organizerId === userId){
    const groupEdit = await groupFind.save({
        name,
        about,
        type,
        private,
        city,
        state,
        organizerId:userId
    })
   return res.json(groupEdit)} else
   {
    const err = new Error("Bad Request")
    err.status = 400
    next(err)
   }
}else{
    const err = new Error("Group couldn't be found")
    err.status = 400
    next(err)
}})

router.delete('/:groupId', requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const groupId = req.params.groupId

    const groupGet = await Group.findByPk(groupId)
    if (groupGet){
        if (groupGet.organizerId === userId){
            Group.destroy(groupGet)

            return res.json("Successfully deleted")
        }
    }else{
        const err = new Error("Group couldn't be found")
        err.status = 404
        next(err)
    }
})

router.post('/:groupId/venues', requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const groupId = req.params.groupId
    const {address, city, state, lat, lng} =req.body
        //potential problem point
    const membershipCheck = await Membership.findAll({where:{
        userId,   //might need to specify
        groupId,
    }})

    const groupCheck = await Group.findByPk(groupId)
    if (groupCheck){
    if (groupCheck.organizerId===userId||membershipCheck.status==='co-host'){
        const venueBuild = await groupCheck.createVenue({
            address,
            city,
            state,
            lat,
            lng
        })
        const venReturn = {
            id:venueBuild.id,
            groupId:venueBuild.groupId,
            address:venueBuild.address,
            city:venueBuild.city,
            state:venueBuild.state,
            lat:venueBuild.lat,
            lng:venueBuild.lng
        }
        return res.json(venReturn)
    }}else{
    const err= new Error("Group couldn't be found")
    err.status = 404
    next(err)
}})

router.get('/:groupId/venues', requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const groupId = req.params.groupId

    const membershipCheck = await Membership.findAll({where:{
        userId:userId,
        groupId:groupId
    }})

    const groupCheck = await Group.findByPk(groupId)

    if(groupCheck){
    if (groupCheck.organizerId===userId||membershipCheck.status==='co-host'){
        const venueFind = await Venue.findAll({
            where: {groupId}
        })
        const venueReturn = []
        for (const ven of venueFind){
        const venReturn = {
            id:ven.id,
            groupId:ven.groupId,
            address:ven.address,
            city:ven.city,
            state:ven.state,
            lat:ven.lat,
            lng:ven.lng
        }
        venueReturn.push(venReturn)
    }
        return res.json(venueReturn)
    }}else{
    const err= new Error("Group couldn't be found")
    err.status = 404
    next(err)
}})

router.get('/:groupId/events', async(req, res, next)=>{
    const groupId = req.params.groupId
    const findGroup = await Group.findByPk(groupId)
    if (!findGroup){
        const err= new Error("Group couldn't be found")
        err.status = 404
        next(err)
    }

    const getAllEvents = await Event.findAll({
        where:{groupId:groupId},
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


module.exports = router;
