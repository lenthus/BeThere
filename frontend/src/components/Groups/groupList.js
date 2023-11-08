import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { getGroups } from "../../store/groups";
import GroupLink from "./groupLink";

const GroupList = () =>{
    const {groups} = useSelector(state =>state.groups)
    console.log(groups)
    const dispatch=useDispatch()




    useEffect(()=>{
        dispatch(getGroups())
    },[groups])

    return (
        <>
        <Link to={``}>Events</Link>
        <Link to={``}>Groups</Link>
        <section>
            {groups.map((group) => (
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
