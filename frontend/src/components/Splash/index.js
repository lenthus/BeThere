import React from "react";
import { Link } from "react-router-dom";

const Splash = ()=>{

    return (
        <>
            <Link to={`/groups`}><h5>Groups</h5></Link>
            <h1>Hello from Splash</h1>
        </>
    )

}

export default Splash
