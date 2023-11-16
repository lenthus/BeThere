import React from "react";
import { useParams } from "react-router-dom";
import { getGroupDetails, getNumberEvents } from "../../store/groups";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEventDetails, getGroup } from "../../store/events";
import { getEvents } from "../../store/events";
import EventGroup from "./EventGroup";


const EventDetail = () =>{
    const { eventId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const event = useSelector((state) => state.events.currEvent);
    // const group = useSelector((state) => state.events.group);
    const imgFinder =(image)=>image.preview===true

    useEffect(() => {
        dispatch(getEventDetails(eventId))
        .then(() => setIsLoading(false));
      }, [dispatch, eventId]);


      if (!isLoading) {
        return (
        <>
        <h1>Hello from eventDetail
            </h1>
            <EventGroup groupId={event.Group.id}/>
            <img src={event.EventImages.filter(imgFinder)[0]?.url}></img>
            <div className= "eventDate">
            <div><h3>Start {event.startDate.split("T")[0]} {"\u00b7"} {event.startDate.split("T")[1].split(".")[0]}</h3></div>
            <div><h3>End {event.endDate.split("T")[0]} {"\u00b7"} {event.endDate.split("T")[1].split(".")[0]}</h3></div>
            <div><h3>{event.price}</h3></div>
            <div><h3>{event.type}</h3></div>
            </div>
            <div className="eventDetails"><p>{event.description}</p></div>
        </>
    )
}
}

export default EventDetail
