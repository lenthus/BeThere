import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEventDetails, getGroup } from "../../store/events";
import EventGroup from "./EventGroup";
import OpenModalButton from "../OpenModalButton";
import EventDeleteModal from "./EventDelete";
import { getGroupDetails } from "../../store/groups";
import { useRef } from "react";
import {useHistory} from 'react-router-dom'




const EventDetail = () =>{
    const { eventId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [groupId,setGroupId]=useState("")
    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch();
    const event = useSelector((state) => state.events.currEvent);
    const imgFinder =(image)=>image.preview===true
    const group = useSelector((state) => state.groups.currGroup);
    const ulRef = useRef();
    const history = useHistory()


    const isOrganizer = user?.id===group.organizerId?true:false

    useEffect(() => {
        dispatch(getEventDetails(eventId))
        // .then(()=>setGroupId(event.groupId))
        .then((res) => dispatch(getGroupDetails(res.groupId)))
        .then(() => setIsLoading(false));
      }, [dispatch, eventId,groupId]);

      const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
      };

      useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
          if (!ulRef.current?.contains(e.target)) {
            setShowMenu(false);
          }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
      }, [showMenu]);
      const closeMenu = () => setShowMenu(false);

      const handleUpdateEvent = () =>{
        history.push(`/events/${eventId}/edit`)
      }
      console.log("organizer",isOrganizer)
      console.log("group",group)
      if (!isLoading) {
        return (
        <>
        <div className="eventlink">
            <h4> &lt; <Link to={`/events`}>Events</Link> </h4></div>
        <h2>{event.name}</h2>
        <p>Hosted by {group.Organizer.firstName} {group.Organizer.lastName}</p>
            <EventGroup groupId={event.Group.id}/>
            <img src={event.EventImages.filter(imgFinder)[0]?.url}></img>

        {(isOrganizer)&&(
        <div>
          <button onClick={handleUpdateEvent}>Update</button>
           <OpenModalButton
              buttonText="Delete"
              modalComponent={<EventDeleteModal
              groupId={group.id}
              eventId={eventId}
              />}

            />
        </div>)}
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
