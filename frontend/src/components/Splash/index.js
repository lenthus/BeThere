import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Splash = ()=>{
    const user = useSelector(state => state.session.user);

    return (
        <>
            <Link to={`/groups`}><h5>Groups</h5></Link>
            <h1>Hello from Splash</h1>
            <div>
            {user && <Link to="/groups/new" >Start a group</Link>}
        </div>
        </>
    )

}

export default Splash
