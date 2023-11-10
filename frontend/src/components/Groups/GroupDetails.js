import React from "react";
import { useParams } from 'react-router-dom'
import { getGroupDetails } from "../../store/groups";
import { useSelector,useDispatch } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";


const GroupDetails = () =>{
    const {groupId} = useParams()
    const group = useSelector(state =>state.groups.currGroup)

    console.log("I am the groupDetails",group)
    const dispatch=useDispatch()

    useEffect(()=>{
        dispatch(getGroupDetails(groupId))
    },[])
    const handleButton = ()=>{
        alert("Feature Coming Soon...")
    }
    return (
        <>
        <Link to={`/groups`}><h5>Groups</h5></Link>
        {/* <img src={group.GroupImages[0].url} /> */}
      <div className="li-contents-flex">
        <div><h2>{group.name}</h2></div>
        <h1>Hello from Group Details {groupId}</h1>
        </div>
        <div>
            <h4>{group.city}</h4>
        </div>
        <div>
            <button onClick={handleButton}>Join this group</button>
        </div>

        </>
    )
}

export default GroupDetails
