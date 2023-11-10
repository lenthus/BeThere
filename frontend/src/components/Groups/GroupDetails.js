import React from "react";
import { useParams } from 'react-router-dom'
import { getGroupDetails } from "../../store/groups";
import { useSelector,useDispatch } from "react-redux";
import { useEffect } from "react";


const GroupDetails = () =>{
    const {groupId} = useParams()
    const {groupDetails} = useSelector(state =>state)
    console.log(groupDetails)
    const dispatch=useDispatch()

    useEffect(()=>{
        dispatch(getGroupDetails(groupId))
    },[])


    return (
        <>
        <h1>Hello from Group Details {groupId}</h1>
        </>
    )
}

export default GroupDetails
