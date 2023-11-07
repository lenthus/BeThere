import { Dispatch } from "react"

// taken from forms practice and modified
export const LOAD_EVENTS = 'events/LOAD_EVENTS'
export const CREATE_EVENT = 'events/CREATE_EVENT'
export const UPDATE_EVENT = 'events/UPDATE_EVENT'
export const DELETE_EVENT = 'events/DELETE_EVENT'

/**  Action Creators: */
export const loadEvents = (events) => ({
  type: LOAD_EVENTS,
  events,
});

export const createEvent = (event) => ({
  type: CREATE_EVENT,
  event,
});

export const updateEvent = (event) => ({
  type:   UPDATE_EVENT,
  event,
});

export const deleteEvent = (eventId) => ({
  type: DELETE_EVENT,
  eventId,
});

/** Thunk Action Creators: */

export const getEvents = (events) => async dispatch => {
  const res = await fetch('/api/events')
  const data =await res.json()
  res.data = data;
  if (res.ok){
    const events = await res.json()
    dispatch(loadEvents(data.Groups))
  }else{
    throw res
  }
}
/** The reports reducer is complete and does not need to be modified */
const reportsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_EVENTS:
      const eventsState = {};
      action.events.forEach((event) => {
        eventsState[event.id] = event;
      });
      return eventsState;
    case CREATE_EVENT:
      return { ...state, [action.event.id]: action.event };
    case UPDATE_EVENT:
      return { ...state, [action.event.id]: action.event };
    case DELETE_EVENT:
      const newState = { ...state };
      delete newState[action.eventId];
      return newState;
    default:
      return state;
  }
};

export default eventsReducer;
