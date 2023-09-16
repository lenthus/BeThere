const express = require('express');
const { Op } = require('sequelize');
const { Event, Group, Image, Membership,User,Venue,Attendee} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { memberCheck } = require('../../utils/checks');
const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next)=>{
    const userId = req.user.id
    const imageId = req.params.imageId

    const imageCheck = await Image.findByPk(imageId)

    if(!imageCheck){
        const err = new Error("Group Image couldn't be found")
        err.status = 404
        next(err)
    }
    if(imageCheck.imageType !== "Group"){
        const err = new Error("Group Image couldn't be found")
        err.status = 404
        next(err)
    }
    const groupCheck = await Group.findByPk(imageCheck.imageableId)

    if(groupCheck.organizerId!==userId && memberCheck(userId,groupCheck.id)!=="co-host"){
        const err = new Error("Group Image couldn't be found")
        err.status = 404
        next(err)
    }else{
        await imageCheck.destroy()
        return res.json({"message": "Successfully deleted"})
    }

})
module.exports = router;
