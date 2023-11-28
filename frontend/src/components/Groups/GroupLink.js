import { Link } from "react-router-dom";
import { getNumberEvents } from "../../store/groups";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import "./GroupLink.css"
import { useState } from "react";

const GroupLink = ({group})=>{

    const [event, setEvent]=useState({})
    const [isLoading, setIsLoading] = useState(true);
    const dispatch= useDispatch()
    // const event = useSelector((state) => state.groups.Events);

    useEffect(() => {
       dispatch(getNumberEvents(group.id))
      .then((anything) => setEvent(anything))
      .then(() => setIsLoading(false));
    }, [dispatch,group.id]);

    if(!isLoading){
    console.log(group.id,group)
    return(
        <>
    <div className = 'groupBox'>
      <div className="groupListImage">
    <img src={group.previewImage} /></div>
      <div className="li-contents-flex">
        <div><h2>{group.name}</h2></div>
        <div><h3>{group.city}, {group.state}</h3></div>
        <div><p>{group.about}</p></div>
        <div><h3>{event.Events.length} Events {"\u00b7"}{" "}</h3>
        <h3>{group.private?"Private":"Public"}</h3></div>
        <div className="buttons-container">

        {/* <Link className="edit-link" to={`/groups/${group.id}/edit`}> Edit </Link> */}
        </div>
      </div>
      </div>
      <hr className='solid'/>
    </>
    )
}}
export default GroupLink
