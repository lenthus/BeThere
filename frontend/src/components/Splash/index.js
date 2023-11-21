import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Splash = ()=>{
    const user = useSelector(state => state.session.user);

    return (
        <>
            <Link to={`/groups`}><h5>See All Groups</h5></Link>
            <Link to={`/events`}><h5>Find an event</h5></Link>
            <div>
            {user && <Link to="/groups/new" >Start a group</Link>}
        </div>
        </>
    )

}

export default Splash
