import { getGroup } from "../../store/events"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./EventGroup.css"

const EventGroup= ({groupId})=>{
const [isLoading, setIsLoading] = useState(true);

const dispatch = useDispatch()
const group = useSelector((state) => state.events.group);


    useEffect(() => {
        dispatch(getGroup(groupId))
        .then(() => setIsLoading(false));
      }, [dispatch, groupId]);

console.log("from group detail" ,group)
const imgFinder =(image)=>image.preview===true
// console.log("from eventgroup",groupId)

if (!isLoading) {
    return(
        <>
        <div className="eventGroupBox">
        <Link to ={`/groups/${group.id}`}>
        <div className="EventGroupImage">
        <img src={group.GroupImages.filter(imgFinder)[0].url}></img>
        </div>
        <div className="EventGroupInfo">
        <h3>{group.name}</h3>
        <h3>{group.private===true?"Private":"Public"}</h3>
        </div>
        </Link>
        </div>
        </>

    )}
}

export default EventGroup
