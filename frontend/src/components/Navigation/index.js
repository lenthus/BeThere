
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import image from "../../images/BThereLogo.jpg"

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <>
    <NavLink exact to="/"><img className="logo" src={image}></img></NavLink>
    <ul className='loginMenu'>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
    <hr className='solid'/>
    </>
  );
}

export default Navigation;
