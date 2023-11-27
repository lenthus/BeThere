import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./splash.css"

const Splash = ()=>{
    const user = useSelector(state => state.session.user);

    return (
        <>
        <div id="splashContainer">
            <div className="BeThereAbout"><h3>Be There. Or Be Square.</h3></div>
            <div className="aboutText"><p style={{fontSize:30}}>Don't let them talk behind your back. Catch them in the act, by knowing When and Where!</p> </div>
            <div className="eye"><i class="fa-solid fa-eye fa-beat"
            style={{fontSize:100}}
            ></i></div>

            <Link id="one" to={`/groups`}><h3><i style={{marginRight:10}} className="fa-solid fa-user-group"></i><u>See All Groups</u></h3></Link>
            <Link id="two" to={`/events`}><h3><i style={{marginRight:10}}className="fa-solid fa-magnifying-glass fa-beat"></i><u>Find an event</u></h3></Link>
            <Link className="startNew" to="/groups/new" style={{pointerEvents: user? '' : 'none',color:user?"":"grey"}}><h3><i style={{marginRight:10}} class="fa-solid fa-play"></i><u>Start a group</u></h3></Link>
        <div className="joiner">
            {!user && <button>Join BeThere!!</button>}
        </div>
        </div>
        </>
    )

}

export default Splash
