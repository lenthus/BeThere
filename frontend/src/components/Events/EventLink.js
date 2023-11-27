import React from "react";
import "./EventLink.css"

import { useDispatch } from "react-redux";

const EventLink = ({event})=>{
    const dispatch= useDispatch()
    console.log("from eventlink",event)
    return(
        <>
    <div className = 'eventBox'>
      <div className="eventListImage">
    <img src={event.previewImage} />
    </div>
      <div className="li-contents-flex">
        <div className="one"> {event.startDate.split("T")[0]} {"\u00b7"}{" "} {event.startDate.split("T")[1].split(".")[0]}</div>
        <div className="two"><h2>{event.name}</h2></div>
        <div className="three"><h3>{event.Venue.city}, {event.Venue.state}</h3></div>
        <div><p>{event.description}</p></div>
        <div className="buttons-container">
          {/* <Link className="edit-link" to={`/groups/${group.id}/edit`}> Edit </Link> */}

        </div>
      </div>
      </div>
      <hr className='solid'/>
    </>
    )
}
export default EventLink
