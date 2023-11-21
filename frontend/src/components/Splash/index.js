import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./splash.css"

const Splash = ()=>{
    const user = useSelector(state => state.session.user);

    return (
        <>
        <div className="wrapper">
            <Link to={`/groups`}><h3>See All Groups</h3></Link>
            <Link to={`/events`}><h3>Find an event</h3></Link>
            <div className="newGroup">
            {user && <Link to="/groups/new" ><h3>Start a group</h3></Link>}
        </div>
        </div>
        </>
    )

}

export default Splash
