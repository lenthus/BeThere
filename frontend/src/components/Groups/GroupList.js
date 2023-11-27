import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { getGroups } from "../../store/groups";
import GroupLink from "./GroupLink";
import "./GroupList.css"

const GroupList = () =>{
    const groups = useSelector(state =>state.groups.groups)

    const dispatch=useDispatch()

    useEffect(()=>{
        dispatch(getGroups())
        // .then(() => dispatch(getNumberEvents(groups.id)))
    },[])

    return (
        <>

        <div className="MainLinks">
        <Link to={`/events`}
        style={{"color":"gray"}}
        ><h2>Events</h2></Link>
        <Link  to={`/groups`}
        style={{"color":"teal"}}
        ><h2 className="current">Groups</h2></Link>
        <p>Groups in Meetup</p>
        <hr className='solid'/>
        <div className="wrapper">
        </div>
        <section>
            {Object.values(groups).map((group) => (
              <Link to={`/groups/${group.id}`}>{<GroupLink
                group={group}
                key={group.id}
              />}</Link>

            ))}
        </section>
        </div>
        </>
      );
    };

    export default GroupList;
