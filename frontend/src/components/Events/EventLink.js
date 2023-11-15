import React from "react";

import { useDispatch } from "react-redux";

const EventLink = ({event})=>{
    const dispatch= useDispatch()
    console.log("from eventlink",event)
    return(
        <>
    <div className = 'eventBox'>
    <img src={event.previewImage} />
      <div className="li-contents-flex">
        <div><h2>{event.name}</h2></div>
        <div><h3>{event.city}, {event.state}</h3></div>
        <div><p>{event.about}</p></div>
        <div><h3>{event.numEvents} Events</h3></div>
        <div className="buttons-container">
          {/* <Link className="edit-link" to={`/groups/${group.id}/edit`}> Edit </Link> */}
        </div>
      </div>
      </div>
     
    </>
    )
}
export default EventLink
