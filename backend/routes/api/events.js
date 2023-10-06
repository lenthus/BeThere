const express = require('express');
const { Op } = require('sequelize');
const {Event, Venue, Membership, Group, Image, Attendee, User} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();
const { validationResult, check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

validateEvent = [
check('page').optional({checkFalsy: true}).isInt({min:1,max:10}).withMessage("Page must be greater than or equal to 1"),
check('size').optional({checkFalsy: true}).isInt({min:1,max:20}).withMessage("Size must be greater than or equal to 1"),
check('name').optional({checkFalsy: true}).isString().withMessage("Name must be a string"),
check('type').optional({checkFalsy: true}).isIn(["Online","In Person"]).withMessage("Type must be 'Online' or 'In Person'"),
check('startDate').optional({checkFalsy: true}).isISO8601().toDate().withMessage("Start date must be a valid datetime"),
handleValidationErrors
]
// check('date-of-birth').isISO8601().toDate(),
router.get('/',validateEvent, async(req,res)=>{
    let {page, size, name, type, startDate} = req.query
    const evReturn = []
    let counter = 0
// console.log(JSON.parse(req.query))
    // const error = validationResult(req)
    // let errors = {}
    // for (const msg of error.errors){
    // if (msg.value){
    //     errors[msg.path]=msg.msg
    //     counter++
    // }}

    let pagination={}
    if (name){
        pagination.name=name
    }
    if(type){
        pagination.type=type
    }
    if (startDate){
        pagination.startDate=startDate
    }
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
        size = 20
    }
    const limit = size
    const offset = ((page-1)*limit)

    // if(counter>0){
    //     return res.status(400).json({"message":"Bad Request",errors})
    // }

    const getAllEvents = await Event.findAll({
        include:[
            {model:Group},
            {model:Venue},
        ],
        where:pagination,limit,offset
    })

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
    return res.json({"Events":evReturn})
})


router.post('/:eventId/images', requireAuth, async(req, res,next)=>{
    const eventId = req.params.eventId
    const userId = req.user.id
    const {url, preview} = req.body



    const eventCheck = await Event.findByPk(eventId)

    if(!eventCheck){
        const err = new Error("Event couldn't be found")
        err.status = 404
       return next(err)
    }
    const groupCheck = await Group.findByPk(eventCheck.groupId)
    const groupId = groupCheck.id

    const membershipCheck = await Membership.findOne({where:
        {userId,
        groupId}
    })

    const getAttendee = await Attendee.findOne({where:{userId:userId,eventId:eventId}})


    if (!eventCheck){
    const err = new Error("Event couldn't be found")
    err.status = 404
    return next(err)
    }
    if (getAttendee&&getAttendee.status==="attending"){
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
    return res.json(imgReturn)}
    if (membershipCheck){
    if (membershipCheck.status==="co-host"){
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
    }}
    if (groupCheck.organizerId===userId){
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

        const err = new Error("Forbidden")
        err.status = 403
       return next(err)
   })
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
   return next(err)
    }
        let img = null
        const numMembers = await Attendee.count({where:{eventId:event.id}})
        // const imageGetter = await Image.findOne({where:{imageableId:event.id,preview:true,imageType:"Event"}})
        const allImages = await Image.findAll({where:{imageableId:event.id,imageType:"Event"}})
        const evenReturn = {
            id:event.id,
            groupId:event.groupId,
            venueId:event.venueId,
            name:event.name,
            description:event.description,
            type:event.type,
            capacity:event.capacity,
            price:event.price,
            startDate:event.startDate,
            endDate:event.endDate,
            numAttending:numMembers,
            Group:{
                id:event.Group.id,
            name:event.Group.name,
            private:event.Group.private,
            city:event.Group.city,
            state:event.Group.state},
            Venue:{
                id:event.Venue.id,
                address:event.Venue.address,
                city:event.Venue.city,
                state:event.Venue.state,
                lat:event.Venue.lat,
                lng:event.Venue.lng
            },
            EventImages:allImages
        }

    return res.json(evenReturn)
})

router.put('/:eventId', requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const eventId = req.params.eventId
    const {venueId,name,type,capacity,price,description,startDate,endDate} =req.body
    const eventChecker = await Event.findByPk(eventId)


    if (!eventChecker){
          const err = new Error("Event couldn't be found")
                err.status = 404
               return next(err)
    }
    const getGroupId = await Venue.findByPk(venueId)

    if (!getGroupId){
        const err = new Error("Venue couldn't be found")
        err.status = 404
       return next(err)
    }
    const groupCheck = await Group.findByPk(getGroupId.groupId)

    const groupId = getGroupId.groupId

    const membershipCheck = await Membership.findOne({where:
        {userId,
        groupId}
    })
    if (groupCheck.organizerId===userId){
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
        const eventSave = await eventBuild.save()
        return res.json(eventBuild)
    }
    if (membershipCheck){
        if (membershipCheck.status==="co-host"){
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
            const eventSave = await eventBuild.save()
            return res.json(eventBuild)


    }else{
        const err = new Error("Forbidden")
        err.status = 403
       return next(err)}}

         const err = new Error("Forbidden")
         err.status = 403
       return next(err)

    })

router.delete('/:eventId', requireAuth, async (req, res, next)=>{
    const userId = req.user.id
    const eventId = req.params.eventId

    const eventCheck = await Event.findByPk(eventId)
    if (!eventCheck){
        const err= new Error("Event couldn't be found")
        err.status = 404
       return next(err)
    }

    const groupId = eventCheck.groupId
    const membershipCheck = await Membership.findOne({where:
        {userId,
        groupId}
    })
    const groupCheck = await Group.findByPk(groupId)

    if (groupCheck.organizerId===userId||membershipCheck?.status==='co-host'){
    const eventDel = await Event.findByPk(eventId)
    Event.destroy({where:{id:eventId}})

    return res.json({
        "message": "Successfully deleted"
      })
    }
    else{
        const err = new Error("Forbidden")
        err.status = 403
       return next(err)
}
})

router.post('/:eventId/attendance', requireAuth, async(req,res,next)=>{
    const userId = req.user.id
    const eventId = req.params.eventId


    const eventCheck = await Event.findByPk(eventId)

    if (!eventCheck){
        const err= new Error("Event couldn't be found")
        err.status = 404
       return next(err)
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
       return next(err)
        }
        if(attendeeCheck.status==="attending"){
            const err= new Error("User is already an attendee of the event")
        err.status = 400
       return next(err)
        }
    }
    const membershipCheck = await Membership.findOne({where:{userId,groupId}})

    if (membershipCheck){
    if (membershipCheck.status==="co-host"||membershipCheck.status==="member"){
        const attendCreate = await Attendee.create({
            userId:userId,
            eventId:eventId,
            status:"pending"
        })
        eventReturn ={
            userId:userId,
            status:attendCreate.status
        }
        return res.json(eventReturn)
    }}
    if (groupCheck.organizerId===userId){
        const attendCreate = await Attendee.create({
            userId:userId,
            eventId:eventId,
            status:"pending"
        })
        eventReturn ={
            userId:userId,
            status:attendCreate.status
        }
        return res.json(eventReturn)
    }else{
        const err = new Error("Forbidden")
        err.status = 403
       return next(err)
    }
})

router.get('/:eventId/attendees', async(req, res, next)=>{
    const userId = req.user.id
    const eventId = req.params.eventId
    const eventCheck = await Event.findByPk(eventId)

    if(!eventCheck){
        const err = new Error("Event couldn't be found")
        err.status = 404
       return next(err)
    }
    const groupId = eventCheck.groupId

    const groupCheck = await Group.findByPk(groupId)
    const membershipCheck = await Membership.findOne({where:{userId,groupId}})

    if (groupCheck.organizerId === userId||membershipCheck?.status==="co-host"){
       const memberList= await Attendee.findAll({
         where:{eventId:eventId},
    })
        let Members = []
        for(const user of memberList){
            const userDetails = await User.findByPk(user.userId)
             let use={
                id:user.userId,
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
        const memberList= await Attendee.findAll({
            where:{eventId:eventId},
       })
           let Members = []
           for(let user of memberList){
            if (user.status!=="pending"){
               const userDetails = await User.findByPk(user.userId)
                let use={
                   id:user.id,
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
        eventCheck = await Event.findByPk(eventId)
        if(!eventCheck){
            const err= new Error("Event couldn't be found")
        err.status = 404
       return next(err)
        }

        if(!attendanceGet){
            const err = new Error("Attendance between the user and the event does not exist")
            err.status = 404
           return next(err)
        }

        if(status==="pending"){
            const err = new Error("Cannot change an attendance status to pending")
            err.status = 400
          return next(err)
        }
        const groupCheck = await Group.findByPk(eventCheck.groupId)
        const memberGet = await Membership.findOne({where:{userId}})

        if (groupCheck){
        if(groupCheck.organizerId===userId){

            const memberMake = await attendanceGet.set({
                status:"attending"
            })
            const memberReturn =  {
                id:memberId,
                eventId:eventId,
                UserId:memberId,
                status:memberMake.status
            }
            await memberMake.save()
            return res.json(memberReturn)

        }
        if (memberGet?.status==="co-host"&&status==="attending"){
            const memberMake = await attendanceGet.set({
                status:"attending"
            })
            const memberReturn =  {
                id:memberId,
                eventId:eventId,
                UserId:memberId,
                status:memberMake.status
            }
            await memberMake.save()
            return res.json(memberReturn)

        }
        if(groupCheck.organizerId!==userId||memberGet?.status!=="co-host"){
            const err = new Error("Forbidden")
        err.status = 403
       return next(err)
        }
    }})
    router.delete('/:eventId/attendance', requireAuth, async (req, res, next)=>{
        const userId = req.user.id
        const eventId = req.params.eventId
        const memberId = req.body.userId

        const eventCheck = await Event.findByPk(eventId)



        const userCheck = await User.findByPk(memberId)
        if (!userCheck){
            const err = new Error("Attendance does not exist for this User")
            err.status = 404
           return next(err)
        }
        const attendanceCheck = await Attendee.findOne({where:{userId:memberId,eventId:eventId}})

        if (!eventCheck){
            const err = new Error("Event couldn't be found")
              err.status = 404
             return next(err)
        }
        const groupId = eventCheck.groupId
        const groupCheck = await Group.findByPk(groupId)
        const memberCheck = Membership.findOne({where:{userId:memberId,groupId:groupId}})

        if(groupCheck.organizerId!==userId&&memberId!==userId){
            const err = new Error("Only the User or organizer may delete an Attendance")
              err.status = 403
             return next(err)
        }

        if(!attendanceCheck){
            const err = new Error("Attendance does not exist for this User")
              err.status = 404
             return next(err)
         }
         if(groupCheck.organizerId===userId){
         await Attendee.destroy({where:{userId:memberId,eventId:eventId}})
         return res.json({
            "message": "Successfully deleted attendance from event"
          })
        }
        if(memberId===userId){
            await Attendee.destroy({where:{userId:memberId,eventId:eventId}})
            return res.json({
               "message": "Successfully deleted attendance from event"
             })
        }
        if(memberCheck){
            if(memberCheck.status==="co-host"){
                await Attendee.destroy({where:{userId:memberId,eventId:eventId}})
                return res.json({
                   "message": "Successfully deleted attendance from event"
                 })
            }
        }
        const err = new Error("Forbidden")
        err.status = 403
       return next(err)
    })

module.exports = router;
