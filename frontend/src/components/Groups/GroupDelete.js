import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { groupDeleteFetch } from "../../store/groups";
import {useHistory} from 'react-router-dom'
import "./GroupDelete.css"


function GroupDeleteModal({groupId}) {
  const history=useHistory()
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(groupDeleteFetch(groupId))
    closeModal()
    history.push("/groups")
  };

  return (
    <>
    <div className="groupDeleteBox">
      <div><h1>Confirm Delete</h1></div>
    <div>
      <h2>Are you sure you want to remove this group?</h2>
    </div>
    <div className="btn">
        <button
        type="confirm"
        onClick={handleSubmit}
        style={{backgroundColor:"red"}}
        >Yes (Delete Group)</button></div>
        <div className="btn">
        <button
         type="cancel"
         style={{backgroundColor:"gray"}}
         onClick={closeModal}
         >No (Keep Group)</button>
    </div>
    </div>
    </>
  );
}

export default GroupDeleteModal;
