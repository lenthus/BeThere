import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { groupDeleteFetch } from "../../store/groups";
import {useHistory} from 'react-router-dom'


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
      <h1>Are you sure you want to remove this group?</h1>

        <button
        type="confirm"
        onClick={handleSubmit}
        >Yes(Delete Group)</button>
        <button
         type="cancel"
         onClick={closeModal}
         >No (Keep Group)</button>

    </>
  );
}

export default GroupDeleteModal;
