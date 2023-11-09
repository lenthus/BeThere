import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { getGroups } from "../../store/groups";
import GroupLink from "./GroupLink";

const GroupList = () =>{
    const {groups} = useSelector(state =>state)
    console.log(groups)
    const dispatch=useDispatch()




    useEffect(()=>{
        dispatch(getGroups())
    },[])

    return (
        <>
        <Link to={`/events`}>Events</Link>
        <Link to={`/groups`}>Groups</Link>
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
