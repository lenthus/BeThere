
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import image from "../../images/BThereLogo.jpg"
import { Link } from 'react-router-dom';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <>
    <div className='navGrid'>
    <NavLink exact to="/"><img className="logo" src={image}></img></NavLink>
    <ul className='loginMenu'>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
    {sessionUser &&(
    <div className='GroupStart'>
      <Link to="groups/new"><h4>Start a New Group</h4></Link>
    </div>
    )}
    <div className='dividerBar'>

    </div>
    </div>
    <hr className='solid'/>
    </>
  );
}

export default Navigation;
