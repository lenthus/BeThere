import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { eventDeleteFetch } from "../../store/events";
import {useHistory} from 'react-router-dom'


function EventDeleteModal({groupId,eventId}) {
  const history=useHistory()
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(eventDeleteFetch(eventId))
    closeModal()
    history.push(`/groups/${groupId}`)
  };

  return (
    <>
      <h1>Are you sure you want to remove this Event?</h1>

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

export default EventDeleteModal;
