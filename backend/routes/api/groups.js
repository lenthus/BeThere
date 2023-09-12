const express = require('express');
const { Op } = require('sequelize');
const { Event, Group, Image, Membership,User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.get('/', async(req,res)=>{
    const getAllGroups = await Group.findAll({
        include:[{
            model:Image
        }]
    })

    return res.json(getAllGroups)
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
        return res.json(venueBuild)
    }}else{
    const err= new Error("Group couldn't be found")
    err.status = 404
    next(err)
}})
router.get('/:groupId/venues', requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const groupId = req.params.groupId
    const {address, city, state, lat, lng} =req.body

    const membershipCheck = await Membership.findAll({where:{
        userId,
        groupId,
    }})

    const groupCheck = await Group.findByPk(groupId)

    if (groupCheck.organizerId===userId||membershipCheck.status==='co-host'){
        const venueFind = await venue.findAll({
            where: groupId
        })
        return res.json(venueFind)
    }
    const err= new Error("Group couldn't be found")
    err.status = 404
    next(err)
})


module.exports = router;
