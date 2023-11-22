import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./splash.css"

const Splash = ()=>{
    const user = useSelector(state => state.session.user);

    return (
        <>
        <div id="splashContainer">
            <div id="two"></div>
<section className="Links">
            <Link id="one" to={`/groups`}><h3>See All Groups</h3></Link>
            <Link id="two" to={`/events`}><h3>Find an event</h3></Link>
            {/* <div className="newGroup"> */}
            {user && <Link to="/groups/new" ><h3>Start a group</h3></Link>}
        {/* </div> */}
        </section>
        <div className="joiner">
            {!user && <button>Join BeThere!!</button>}
        </div>
        </div>
        </>
    )

}

export default Splash
