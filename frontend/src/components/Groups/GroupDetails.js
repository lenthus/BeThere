import React from "react";
import { useParams } from 'react-router-dom'
import { getGroupDetails, getNumberEvents } from "../../store/groups";
import { useSelector,useDispatch } from "react-redux";
import { useEffect,useState } from "react";
import { Link } from "react-router-dom";


const GroupDetails = () =>{
   const {groupId}= useParams()

    const [isLoading, setIsLoading]=useState(true)

    const group = useSelector(state =>state.groups.currGroup)
    console.log("I am the groupDetails",group)
    const dispatch=useDispatch()

    const events = useSelector(state =>state.groups.Events)
    console.log("event",events)

    useEffect(()=>{
        dispatch(getGroupDetails(groupId)).then(()=>dispatch(getNumberEvents(groupId)))
        .then(()=>setIsLoading(false))
      },[dispatch, groupId])

    // useEffect(()=>{
    //     dispatch(getNumberEvents(groupId))
    // },[])
    const handleStatus = (status)=> status===true?"Private":"Public"


    const handleButton = ()=>{
        alert("Feature Coming Soon...")
    }

    if(!isLoading){
        return (
        <>
        <Link to={`/groups`}><h5>Groups</h5></Link>
        <img src={group.GroupImages[0].url} />
      <div className="li-contents-flex">
        <div><h2>{group.name}</h2></div>
        <h1>Hello from Group Details {groupId}</h1>
        </div>
        <div>
            <h4>{group.city}</h4>
        </div>
        <div>{events.length} events</div>
        <div>{handleStatus(group.Private)}</div>
        <div> Organized By {group.Organizer.firstName} {group.Organizer.lastName}</div>
        <div>
            <button onClick={handleButton}>Join this group</button>
        </div>
        <div className="EventsPart">
            <div><h3>Organizer</h3></div>
            <div>{group.Organizer.firstName} {group.Organizer.lastName}</div>
            <div><h4>What we're about</h4></div>
            <div><p>{group.about}</p></div>
        </div>

        </>
    )}
}

export default GroupDetails
