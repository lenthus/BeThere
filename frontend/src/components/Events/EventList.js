import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { getGroups } from "../../store/groups";
// import GroupLink from "./GroupLink";
import EventLink from "./EventLink";
import { getEvents } from "../../store/events";
import "./EventList.css"

const EventList = () =>{
    const events = useSelector(state =>state.events.events)
    console.log("from event list",events)
    const dispatch=useDispatch()

    useEffect(()=>{
        dispatch(getEvents())
    },[])


    return (
        <>
        <div className="wrapper">
        <div className="MainLinks">
        <Link to={`/events`}><h2 className="current">Events</h2></Link>
        <Link to={`/groups`}><h2>Groups</h2></Link>
        <hr className='solid'/>
        </div>
        <section>
            {Object.values(events).map((event) => (
              <Link to={`/events/${event.id}`}>{<EventLink
                event={event}
                key={event.id}
              />}</Link>

            ))}
        </section>
        </div>
        </>
      );
    };

    export default EventList;
