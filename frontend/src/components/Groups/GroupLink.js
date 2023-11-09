import { Link } from "react-router-dom";
import { Dispatch } from "react";
import { useDispatch } from "react-redux";

const GroupLink = ({group})=>{
    const dispatch= useDispatch()
    console.log("from grouplink",group)
    return(
        <>
    <div className = 'groupBox'>
    <img src={group.previewImage} />
      <div className="li-contents-flex">
        <div>{group.name}</div>
        <div>{group.city}, {group.state}</div>
        <div>{group.about}</div>
        <div>{group.numEvents} Events</div>
        <div>{group.private?"Private":"Public"}</div>
        <div className="buttons-container">
          {/* <Link className="edit-link" to={`/groups/${group.id}/edit`}> Edit </Link> */}
        </div>
      </div>
      </div>
    </>
    )
}
export default GroupLink
