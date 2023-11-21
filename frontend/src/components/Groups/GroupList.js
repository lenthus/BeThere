import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { getGroups } from "../../store/groups";
import GroupLink from "./GroupLink";

const GroupList = () =>{
    const groups = useSelector(state =>state.groups.groups)
   
    const dispatch=useDispatch()

    useEffect(()=>{
        dispatch(getGroups())
    },[])

    return (
        <>
        <div className="MainLinks">
        <Link to={`/events`}><h2>Events</h2></Link>
        <Link to={`/groups`}><h2>Groups</h2></Link>
        </div>
        <section>
            {Object.values(groups).map((group) => (
              <Link to={`/groups/${group.id}`}>{<GroupLink
                group={group}
                key={group.id}
              />}</Link>

            ))}
        </section>
        </>
      );
    };

    export default GroupList;
