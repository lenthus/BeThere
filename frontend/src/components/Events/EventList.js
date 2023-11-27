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

        <div className="MainLinks">
        <Link
        style={{"color":"teal"}}
        to={`/events`}><h2 className="current">Events</h2></Link>
        <Link
        style={{"color":"gray"}}
        to={`/groups`}><h2>Groups</h2></Link>
        <p>Events in Meetup</p>
        <hr className='solid'/>
        <div className="wrapper">
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
