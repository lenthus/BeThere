const express = require('express');
const { Op } = require('sequelize');
const {Event, Venue, Membership, Group, Image, Attendee, User} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { memberCheck } = require('../../utils/checks');
const router = express.Router();
const { validationResult, check } = require('express-validator');

validateEvent = [
check('page').isInt({min:1,max:10}).withMessage("Page must be greater than or equal to 1"),
check('size').isInt({min:1,max:20}).withMessage("Size must be greater than or equal to 1"),
check('name').isAlpha().withMessage("Name must be a string"),
check('type').isIn(["Online","In Person"]).withMessage("Type must be 'Online' or 'In Person'"),
check('startDate').isDate().withMessage("Start date must be a valid datetime")
]

router.get('/',validateEvent, async(req,res)=>{
    let {page, size, name, type, startDate} = req.query

    let counter = 0

    const error = validationResult(req)
    let errors = {}
    for (const msg of error.errors){
    if (msg.value){
        errors[msg.path]=msg.msg
        counter++
    }}

    if (page){
        page = Number(page)
        if(page>10){
            page = 10
        }
    }else{
        page = 1
    }
    if (size){
        size = Number(size)
        if(size>20){
            size = 20
        }
    }else{
        size = 1
    }
    console.log(page)
    console.log(size)
    const limit = size
    const offset = ((page-1)*limit)

    if(counter>0){
        return res.status(400).json({"message":"Bad Request",errors})
    }

    const getAllEvents = await Event.findAll({
        include:[
            {model:Group},
            {model:Venue},
        ],
        limit,offset
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
    const eventId = req.params.eventId
    const userId = req.user.id
    const {url, preview} = req.body

    const eventCheck = await Event.findByPk(eventId)
    console.log(eventCheck)
    const getAttendee = await Attendee.findOne({where:{userId}})
    const groupCheck = await Group.findByPk(eventCheck.groupId)

    if (eventCheck){

    if (getAttendee||memberCheck(userId,eventCheck.groupId)==="co-host"||groupCheck.organizerId===userId){
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
    return res.json(imgReturn)
}
    else{
        const err = new Error("Event couldn't be found")
        err.status = 404
        next(err)
    }
}else{
    const err = new Error("Event couldn't be found2")
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
    if (!event){
        const err= new Error("Event couldn't be found")
    err.status = 404
    next(err)
    }
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

router.put('/:eventId', requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const eventId = req.params.eventId
    const {venueId,name,type,capacity,price,description,startDate,endDate} =req.body
    const getGroupId = await Venue.findByPk(venueId)
    const eventChecker = await Event.findByPk(eventId)
    const groupId = getGroupId.groupId

    if (!getGroupId){
        const err = new Error("Venue couldn't be found")
        err.status = 404
        next(err)
    }

    if (!eventChecker){
          const err = new Error("Event couldn't be found")
                err.status = 404
                next(err)
    }

    const membershipCheck = await Membership.findAll({where:
        {userId,
        groupId}
    })
    const groupCheck = await Group.findByPk(groupId)

    if (groupCheck){
    if (groupCheck.organizerId===userId||membershipCheck.status==='co-host'){

        const getEvent = await Event.findByPk(eventId)
        const eventBuild = getEvent.set({
           venueId,
           name,
           type,
           capacity,
           price,
           description,
           startDate,
           endDate

        })
        eventBuild.save()

        const eventReturn = {
            id:eventBuild.id,
            venueId:eventBuild.venueId,
            groupId:eventBuild.groupId,
            name:eventBuild.name,
            type:eventBuild.type,
            capacity:eventBuild.capacity,
            price:eventBuild.price,
            description:eventBuild.description,
            startDate:eventBuild.startDate,
            endDate:eventBuild.endDate
        }

        return res.json(eventReturn)
    }}})

router.delete('/:eventId', requireAuth, async (req, res, next)=>{
    const userId = req.user.id
    const eventId = req.params.eventId

    const eventCheck = await Event.findByPk(eventId)


    const groupId = eventCheck.groupId
    const membershipCheck = await Membership.findAll({where:
        {userId,
        groupId}
    })
    const groupCheck = await Group.findByPk(groupId)

    if (groupCheck.organizerId===userId||membershipCheck.status==='co-host'){
    const eventDel = await Event.findByPk(eventId)
    Event.destroy({where:{id:eventId}})

    return res.json("Successfully deleted")
    }
    else{
    const err= new Error("Event couldn't be found")
    err.status = 404
    next(err)
}
})

router.post('/:eventId/attendees', requireAuth, async(req,res,next)=>{
    const userId = req.user.id
    const eventId = req.params.eventId


    const eventCheck = await Event.findByPk(eventId)

    if (!eventCheck){
        const err= new Error("Event couldn't be found")
        err.status = 404
        next(err)
        }
    const groupId = eventCheck.groupId


    const groupCheck = await Group.findByPk(groupId)
    const attendeeCheck = await Attendee.findOne({where:{
        eventId:eventId,
        userId:userId
    }})
    if(attendeeCheck){
        if(attendeeCheck.status==="pending"){
            const err= new Error("Attendance has already been requested")
        err.status = 400
        next(err)
        }
        if(attendeeCheck.status==="accepted"){
            const err= new Error("User is already an attendee of the event")
        err.status = 400
        next(err)
        }
    }


    if (memberCheck(userId,groupId).status==="co-host"||memberCheck(userId,groupId).status==="member"||groupCheck.organizerId===userId){
        const attendCreate = await Attendee.create({
            userId:userId,
            eventId:eventId,
            status:"pending"
        })
        eventReturn ={
            userId:userId,
            eventId:eventId,
            status:attendCreate.status
        }
        return res.json(eventReturn)
    }
})

router.get('/:eventId/attendees', async(req, res, next)=>{
    const userId = req.user.id
    const eventId = req.params.eventId
    const eventCheck = await Event.findByPk(eventId)
    const groupId = eventCheck.groupId

    const groupCheck = await Group.findByPk(groupId)
    if(!eventCheck){
        const err= new Error("Event couldn't be found")
    err.status = 404
    next(err)
    }

    if (groupCheck.organizerId === userId||memberCheck(userId,groupId)==="co-host"){
       const memberList= await Attendee.findAll({
         where:{eventId:eventId},
    })
        let Members = []
        for(const user of memberList){
            const userDetails = await User.findByPk(user.userId)
             let use={
                id:userId,
                firstName:userDetails.firstName,
                lastName:userDetails.lastName,
                Attendance:{
                    status:user.status
                }
            }
            Members.push(use)
        }

        return res.json({"Attendees":Members})
    }else{
        const memberList= await Membership.findAll({
            where:{groupId:groupId},
       })
           let Members = []
           for(let user of memberList){
            if (user.status!=="pending"){
               const userDetails = await User.findByPk(user.userId)
                let use={
                   id:userId,
                   firstName:userDetails.firstName,
                   lastName:userDetails.lastName,
                   Attendance:{
                       status:user.status
                   }
               }
               Members.push(use)
           }}

           return res.json({"Attendees":Members})

     }
    })
    router.put('/:eventId/attendance', requireAuth, async (req, res, next)=>{
        const userId = req.user.id
        const eventId = req.params.eventId
        const {status} = req.body
        const memberId =req.body.userId

        let attendanceGet = await Attendee.findOne({where:{
            userId:memberId,
            eventId:eventId
        }})
        console.log(attendanceGet,memberId,eventId)
        if(!attendanceGet){
            const err = new Error("Attendance between the user and the event does not exist")
            err.status = 404
            next(err)
        }
        eventCheck = await Event.findByPk(eventId)
        if(!eventCheck){
            const err= new Error("Event couldn't be found")
        err.status = 404
        next(err)
        }
        if(status==="pending"){
            const err = new Error("Cannot change an attendance status to pending")
            err.status = 400
            next(err)
        }
        const groupCheck = await Group.findByPk(eventCheck.groupId)
        const memberGet = await Membership.findOne({where:{userId}})

        if (attendanceGet){
        if(groupCheck.organizerId!==userId||memberGet.status!=="co-host"){
            const err= new Error("Event couldn't be found")
            err.status = 404
            next(err)
        }
        if((groupCheck.organizerId===userId||memberGet.status==="co-host")&&status==="attending"){
            const memberMake = await attendanceGet.set({
                status:"attending"
            })
            const memberReturn =  {
                id:memberMake.id,
                eventId:eventId,
                UserId:memberId,
                status:memberMake.status
            }
            memberMake.save()
            return res.json(memberReturn)

        }}

    })
    router.delete('/:eventId/attendance', requireAuth, async (req, res, next)=>{
        const userId = req.user.id
        const eventId = req.params.eventId
        const memberId = req.body.userId

        const eventCheck = await Event.findByPk(eventId)


        const userCheck = await User.findByPk(memberId)
        if (!userCheck){
            const err = new Error("Attendance does not exist for this User")
            err.status = 404
            next(err)
        }
        const attendanceCheck = await Attendee.findOne({where:{userId:memberId,eventId:eventId}})

        if (!eventCheck){
            const err = new Error("Event couldn't be found")
              err.status = 404
              next(err)
        }
        const groupId = eventCheck.groupId
        const groupCheck = await Group.findByPk(groupId)

        if(groupCheck.organizerId!==userId&&memberId==userId){
            const err = new Error("Only the User or organizer may delete an Attendance")
              err.status = 403
              next(err)
        }

        if(!attendanceCheck){
            const err = new Error("Attendance does not exist for this User")
              err.status = 404
              next(err)
         }
         await Attendee.destroy({where:{userId:memberId,eventId:eventId}})
         return res.json({
            "message": "Successfully deleted attendance from event"
          })
    })

module.exports = router;
