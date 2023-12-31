const express = require('express');
const { Op, ValidationError } = require('sequelize');
const { Event, Group, Image, Membership,User,Venue,Attendee} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { validationResult, check } = require('express-validator');

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
    const imageGetter = await Image.findOne({where:{imageableId:group.id,preview:true,imageType:"Group"}})
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

    return res.json({"Groups":groupsReturn})
})

router.get('/current', requireAuth, async(req,res,next)=>{
    const userId = req.user.id

    const getUserGroups = await Group.findAll({
        where:{
            organizerId:userId
        },
        include:[
            {model:Image,
            as:'GroupImages'}
        ]

    })
    const groupReturn = []
    for (const group of getUserGroups){
        const members = await Membership.count({where:{groupId:group.id}})
        const imageGetter = await Image.findOne({where:{imageableId:group.id,preview:true}})
    if (imageGetter){
    img = imageGetter.url
    } else{
    img = null
    }
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
    groupReturn.push(newGroup)
    }
    const getMembership = await Membership.findAll({
        where:{userId:userId}
    })
    console.log(getMembership)
    for (const memberShip of getMembership){
    const getMemGroup = await Group.findOne({
        where:{
            id:memberShip.groupId
        },
        include:[
            {model:Image,
            as:'GroupImages'}
        ]
    })
        const members = await Membership.count({where:{groupId:getMemGroup.id}})
        const imageGetter = await Image.findOne({where:{imageableId:getMemGroup.id,preview:true}})
    if (imageGetter){
    img = imageGetter.url
    } else{
    img = null
    }
    const newGroup = {
        id:getMemGroup.id,
        organizerId:getMemGroup.organizerId,
        name:getMemGroup.name,
        about:getMemGroup.about,
        type:getMemGroup.type,
        private:getMemGroup.private,
        city:getMemGroup.city,
        state:getMemGroup.state,
        createdAt:getMemGroup.createdAt,
        updatedAt:getMemGroup.updatedAt,
        numMembers:members,
        previewImage:img
    }
    groupReturn.push(newGroup)


}
return res.json({ Groups:groupReturn})
})

router.get('/:groupId', async(req,res,next)=>{
    const groupId = req.params.groupId

    const getGroups = await Group.findOne({
        where:{ id:groupId },
        include: [
            {model:Image,
            as:'GroupImages'},
            {model:User,
            as:'Organizer',attributes:["id","firstName","lastName"]},
            {model:Venue},
        ]
    })
    const members = await Membership.count({where:{groupId}})
    if (!getGroups) {
    const err = new Error("Group couldn't be found")
    err.status = 404
    return next(err)
}else{
    const groupReturn = {}
    getGroups.dataValues["numMembers"] = members
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

    const imageCheck = await Image.findOne({where:{imageableId:groupId,imageType:"Group",preview:true}})
    if(imageCheck&&preview===true){
    // const err = new Error("Group preview image already exists")
    // err.status = 400
    // next(err)
    return res.status(500).json("Group preview image already exists")
    }

    if (groupCheck.organizerId === userId){
    const imgCreate = await groupCheck.createGroupImage({
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
        const err = new Error("Forbidden")
        err.status = 403
        return next(err)
    }
}else{
    const err = new Error("Group couldn't be found")
    err.status = 404
    return next(err)
}})

router.put('/:groupId', requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const groupId = req.params.groupId
    const {name,about,type,private,city,state} = req.body

    const groupFind = await Group.findByPk(groupId)

    if (!groupFind){
        const err = new Error("Group couldn't be found")
        err.status = 404
        return next(err)
    }
    if (groupFind){
    if (groupFind.organizerId === userId){
    const groupEdit = await groupFind.set({
        name,
        about,
        type,
        private,
        city,
        state,
        organizerId:userId
    })
   const groupReturn = await groupEdit.save()
   return res.json(groupReturn)
    }
    else
   {
    const err = new Error("Forbidden")
        err.status = 403
       return next(err)
   }
}})

router.delete('/:groupId', requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const groupId = req.params.groupId

    const groupGet = await Group.findByPk(groupId)
    if (groupGet){
        if (groupGet.organizerId === userId){
          await groupGet.destroy()

            return res.json({"message":"Successfully deleted"})
        }else{
            const err = new Error("Forbidden")
            err.status = 403
           return next(err)
        }
    }else{
        const err = new Error("Group couldn't be found")
        err.status = 404
       return next(err)
    }
})

router.post('/:groupId/venues', requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const groupId = req.params.groupId
    const {address, city, state, lat, lng} =req.body
        //potential problem point
    const membershipCheck = await Membership.findOne({where:{
        userId,   //might need to specify
        groupId,
    }})

    const groupCheck = await Group.findByPk(groupId)
    if (groupCheck){
    if (groupCheck.organizerId===userId||membershipCheck?.status==='co-host'){
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
    }else{
        const err= new Error("Forbidden")
        err.status = 403
       return next(err)
    }}else{
    const err= new Error("Group couldn't be found")
    err.status = 404
   return next(err)
}})

router.get('/:groupId/venues', requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const groupId = req.params.groupId

    const membershipCheck = await Membership.findOne({where:{
        userId:userId,
        groupId:groupId
    }})

    const groupCheck = await Group.findByPk(groupId)

    if(groupCheck){
    if (groupCheck.organizerId===userId||membershipCheck?.status==='co-host'){
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
        return res.json({"Venues":venueReturn})
    }else{
        const err = new Error("Forbidden")
        err.status = 403
       return next(err)
    }}else{
    const err= new Error("Group couldn't be found")
    err.status = 404
   return next(err)
}})

router.get('/:groupId/events', async(req, res, next)=>{
    const groupId = req.params.groupId
    const findGroup = await Group.findByPk(groupId)
    if (!findGroup){
        const err= new Error("Group couldn't be found")
        err.status = 404
      return  next(err)
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
            description:event.description,
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


const validateThisEvent = [
    check('venueId')
      .isNumeric()
      .custom(async (value) => {
        // Check if the venue exists
        const venue = await Venue.findByPk(value);
        if (!venue) {
          return Promise.reject('Venue does not exist');
        }
      }),
    check('name')
      .isLength({ min: 5 })
      .withMessage('Name must be at least 5 characters'),
    check('type')
      .isIn(['Online', 'In person'])
      .withMessage('Type must be Online or In person'),
    check('capacity').isInt().withMessage('Capacity must be an integer'),
    check('price').isFloat().withMessage('Price is invalid'),
    check('description').notEmpty().withMessage('Description is required'),
    check('startDate').custom((startDate, { req }) => {
      const { endDate } = req.body;
      const currentDate = new Date();

      if (new Date(startDate) < currentDate) {
        throw new Error('Start date must be in the future');
      }
      if (new Date(endDate) < new Date(startDate)) {
        throw new Error('End date must be greater than the start date');
      }

      return true;
    }),
    handleValidationErrors
  ];
router.post('/:groupId/events',requireAuth, validateThisEvent, async(req, res, next)=>{
    const userId = req.user.id
    const groupId = req.params.groupId
    const {venueId,name,type,capacity,price,description,startDate,endDate} =req.body

    const membershipCheck = await Membership.findOne({where:
        {userId,
        groupId}
    })

    // const venueCheck = await Venue.findByPk(venueId)
    // console.log(membershipCheck)
    // if(!venueCheck){
    //     const err = new ValidationError("Venue does not exist")
    //     err.message = "Venue does not exist"
    //     err.status = 404
    //    return next(err)
    // }

    const groupCheck = await Group.findByPk(groupId)
    if (groupCheck){
    if (groupCheck.organizerId===userId||membershipCheck?.status==='co-host'){
        const eventBuild = await groupCheck.createEvent({
           venueId,
           name,
           type,
           capacity,
           price,
           description,
           startDate,
           endDate

        })
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
    }else{
        const err = new Error("Forbidden")
        err.status = 403
       return next(err)
    }}else{
    const err= new Error("Group couldn't be found")
    err.status = 404
   return next(err)
}})


router.get('/:groupId/members', async(req, res, next)=>{

    const groupId = req.params.groupId

    const groupCheck = await Group.findByPk(groupId)
    if (!req.user){
        const memberList= await Membership.findAll({
            where:{groupId:groupId},
       })
           let Members = []
           for await(let user of memberList){
            if (user.status!=="pending"){
               const userDetails = await User.findByPk(user.userId)
                let use={
                   id:userDetails.userId,
                   firstName:userDetails.firstName,
                   lastName:userDetails.lastName,
                   Membership:{
                       status:user.status
                   }
               }
               Members.push(use)
           }}

           return res.json({"Members":Members})

    }
    const userId = req.user.id
    console.log(userId)
    if(!groupCheck){
        const err= new Error("Group couldn't be found")
    err.status = 404
   return next(err)
    }
    if (userId === groupCheck.organizerId){
        const memberList= await Membership.findAll({
            where:{groupId:groupId},
       })
           let Members = []
           for await(const user of memberList){
               const userDetails = await User.findByPk(user.userId)
                let use={
                   id:userDetails.id,
                   firstName:userDetails.firstName,
                   lastName:userDetails.lastName,
                   Membership:{
                       status:user.status
                   }
               }
               Members.push(use)
           }

           return res.json({"Members":Members})
    }
    const membershipCheck = await Membership.findOne({where:{userId:userId,groupId:groupId}})
    if (membershipCheck){
    if (membershipCheck==="co-host"){
       const memberList= await Membership.findAll({
         where:{groupId:groupId},
    })
        let Members = []
        for await(const user of memberList){
            const userDetails = await User.findByPk(user.userId)
             let use={
                id:userDetails.id,
                firstName:userDetails.firstName,
                lastName:userDetails.lastName,
                Membership:{
                    status:user.status
                }
            }
            Members.push(use)
        }

        return res.json({"Members":Members})
    }else{
        const memberList= await Membership.findAll({
            where:{groupId:groupId},
       })
           let Members = []
           for await(let user of memberList){
            if (user.status!=="pending"){
               const userDetails = await User.findByPk(user.userId)
                let use={
                   id:userDetails.id,
                   firstName:userDetails.firstName,
                   lastName:userDetails.lastName,
                   Membership:{
                       status:user.status
                   }
               }
               Members.push(use)
           }}

           return res.json({"Members":Members})

    }}else{
        const memberList= await Membership.findAll({
            where:{groupId:groupId},
       })
           let Members = []
           for await(let user of memberList){
            if (user.status!=="pending"){
               const userDetails = await User.findByPk(user.userId)
                let use={
                   id:userDetails.id,
                   firstName:userDetails.firstName,
                   lastName:userDetails.lastName,
                   Membership:{
                       status:user.status
                   }
               }
               Members.push(use)
           }}

           return res.json({"Members":Members})
        }
    })

router.post('/:groupId/membership', requireAuth, async (req, res, next)=>{
    const userId = req.user.id
    const groupId = req.params.groupId

    groupCheck = await Group.findByPk(groupId)
    if(!groupCheck){
        const err= new Error("Group couldn't be found")
    err.status = 404
   return next(err)
    }

    const memberGet = await Membership.findOne({where:{groupId,userId}})
    if (memberGet){
    if(memberGet.status==="pending"){
        // const err= new Error("Membership has already been requested")
        // err.status = 400
        // next(err)
        return res.status(400).json({
            "message": "Membership has already been requested"
          })
    }
    if(memberGet.status==="member"||memberGet.status==="co-host"){
        const err= new Error("User is already a member of the group")
        err.status = 400
       return next(err)
    }}else{
        const memberMake = await Membership.create({
            groupId:groupId,
            userId:userId,
            status:"pending"
        })
        const memberReturn =  {
            memberId:userId,
            status:memberMake.status
        }
        return res.json(memberReturn)
    }
})

router.put('/:groupId/membership', requireAuth, async (req, res, next)=>{
    const userId = req.user.id
    const groupId = req.params.groupId
    const {memberId, status} = req.body

    let membershipGet = await Membership.findOne({where:{
        userId:memberId,
        groupId:groupId
    }})
    const userCheck = await User.findByPk(memberId)
    if (!userCheck){
        return res.status(400).json({
                "message": "Validation Error",
                "errors": {
                  "memberId": "User couldn't be found"
                }
              })
    }
    const groupCheck = await Group.findByPk(groupId)

    if(!groupCheck){
        const err= new Error("Group couldn't be found")
        err.status = 404
        return next(err)
    }
    if(!membershipGet){
        const err = new Error("Membership between the user and the group does not exist")
        err.status = 404
       return next(err)
    }

    if(status==="pending"){
    return res.status(400).json({
            "message": "Validations Error",
            "errors": {
              "status" : "Cannot change a membership status to pending"
            }
          })
    }
    const memberGet = await Membership.findOne({where:{userId:userId,groupId:groupId}})

    //membership change options
    if(memberGet){
    if(memberGet.status==="co-host"&&status==="co-host"){
        const err = new Error("Forbidden")
        err.status = 403
       return next(err)
    }
    if((memberGet.status==="co-host")&&status==="member"){
        const memberMake = await membershipGet.set({
            status:"member"
        })
        await memberMake.save()
        const memberReturn =  {
            id:membershipGet.id,
            groupId,
            memberId,
            status:membershipGet.status
        }

        return res.json(memberReturn)

    }
    if(memberGet.status==="member"||memberGet.status==="pending"){
        const err = new Error("Forbidden")
        err.status = 403
       return next(err)
    }
    if(memberGet.status!=="co-host"){
        const err = new Error("Forbidden")
        err.status = 403
       return next(err)
    }
    }
    if((groupCheck.organizerId===userId)&&status==="member"){
        const memberMake = await membershipGet.set({
            status:"member"
        })
        await memberMake.save()
        const memberReturn =  {
            id:membershipGet.id,
            groupId,
            memberId,
            status:membershipGet.status
        }


    return res.json(memberReturn)
    }
    if (groupCheck.organizerId===userId&&status==="co-host"){
        const memberMake = await membershipGet.set({
            status:"co-host"
        })
        await memberMake.save()
        const memberReturn =  {
            id:memberId,
            groupId,
            memberId,
            status:membershipGet.status
        }
        return res.json(memberReturn)
    }
    const err = new Error("Forbidden")
    err.status = 403
   return next(err)
})

router.delete('/:groupId/membership', requireAuth, async (req, res, next)=>{
    const userId = req.user.id
    const groupId = req.params.groupId
    const memberId = req.body.memberId

    const groupCheck = await Group.findByPk(groupId)
    const userCheck = await User.findByPk(memberId)
    const membershipCheck = await Membership.findOne({where:{userId:memberId,groupId:groupId}})
    const userMemberCheck = await Membership.findOne({where:{userId:userId,groupId:groupId}})

    if(!userCheck){
        res.statusCode = 400
        const err = new Error()
        err.message = "Validation Error"
        err.errors = {"memberId":"User couldn't be found"}
        return res.json(err)
    }

    if (!groupCheck){
        const err = new Error("Group couldn't be found")
          err.status = 404
        return  next(err)
    }
    if(!membershipCheck){
        const err = new Error("Membership does not exist for this User")
          err.status = 400
         return next(err)
     }
     if (!userMemberCheck){
        const err = new Error("Forbidden")
            err.status = 403
           return next(err)
     }

    if(membershipCheck){
    if(userId===memberId){
        await Membership.destroy({where:{userId:memberId,groupId:groupId}})
        return res.json({
           "message": "Successfully deleted membership from group"
         })
        }
    }
    if(groupCheck.organizerId!==userId&&memberId==userId){
        const err = new Error("Forbidden")
        err.status = 403
       return next(err)
    }

    if(userMemberCheck&&userMemberCheck.status==="co-host"){
        const err = new Error("Forbidden")
        err.status = 403
        return next(err)
    }

    if(!userMemberCheck&&groupCheck.organizerId!==userId){
        const err = new Error("Forbidden")
        err.status = 403
       return next(err)
    }

    if (userMemberCheck&&userMemberCheck.status==="member"){
        const err = new Error("Forbidden")
            err.status = 403
           return next(err)
    }
    if (userMemberCheck&&userMemberCheck.status==="pending"){
        const err = new Error("Forbidden")
            err.status = 403
           return next(err)
    }

     await Membership.destroy({where:{userId:memberId,groupId:groupId}})
     return res.json({
        "message": "Successfully deleted membership from group"
      })
})
module.exports = router;
