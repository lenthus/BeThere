import { Link } from "react-router-dom";
import { Dispatch } from "react";
import { useDispatch } from "react-redux";

const GroupLink = ({group})=>{
    const dispatch= useDispatch()

    return(
        <>
    <div className = 'groupBox'>
    <img src={group.previewImage} />
      <div className="li-contents-flex">
        <div><h2>{group.name}</h2></div>
        <div><h3>{group.city}, {group.state}</h3></div>
        <div><p>{group.about}</p></div>
        <div><h3>{group.numEvents} Events</h3></div>
        <div><h3>{group.private?"Private":"Public"}</h3></div>
        <div className="buttons-container">
        {/* <Link className="edit-link" to={`/groups/${group.id}/edit`}> Edit </Link> */}
        </div>
      </div>
      </div>
    </>
    )
}
export default GroupLink
