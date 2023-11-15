import { Dispatch } from "react"

// taken from forms practice and modified
export const LOAD_EVENTS = 'events/LOAD_EVENTS'
export const CREATE_EVENT = 'events/CREATE_EVENT'
export const UPDATE_EVENT = 'events/UPDATE_EVENT'
export const DELETE_EVENT = 'events/DELETE_EVENT'
export const GET_CURR_GROUP = 'events/GET_CURR_GROUP'
export const EVENT_DETAILS = 'events/EVENT_DETAILS'

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

export const detailEvent = (event) => ({
  type: EVENT_DETAILS,
  event
})
export const infoGroup = (groupId) => ({
  type: GET_CURR_GROUP,
  groupId
})

/** Thunk Action Creators: */

export const getEvents = (events) => async dispatch => {
  const res = await fetch('/api/events')
  const data =await res.json()
  res.data = data;
  if (res.ok){
    // const events = await res.json()
    dispatch(loadEvents(data.Events))
  }else{
    throw res
  }
}
export const getEventDetails = (eventId) => async (dispatch) => {
  const res = await fetch(`/api/events/${eventId}`);
  const data = await res.json();
  res.data = data;
  if (res.ok) {
    dispatch(detailEvent(data));
  } else {
    throw res;
  }
};

export const getGroup = (groupId) => async (dispatch) => {
  const res = await fetch(`/api/groups/${groupId}`)
  const data =await res.json()
  res.data = data;
  if (res.ok){
    // const events = await res.json()
    dispatch(infoGroup(data))
  }else{
    throw res
  }
}
/** The reports reducer is complete and does not need to be modified */
const eventsReducer = (
  state = { events: {}, currEvent: {}, group: {} },
  action
) => {
  switch (action.type) {
    case LOAD_EVENTS:
      const eventsState = {};
      action.events.forEach((event) => {
        eventsState[event.id] = event;
      });
      return { ...state, events: eventsState };

    case CREATE_EVENT: {
      const events = { ...state.events };
      events[action.event.id] = action.event;
      return { ...state, events };
    }

    case UPDATE_EVENT: {
      const events = { ...state.events };
      events[action.event.id] = action.event;
      return { ...state, events };
    }
    // need to update
    case DELETE_EVENT:
      const newState = { ...state };
      delete newState[action.eventId];
      return newState;

    case EVENT_DETAILS:
      return { ...state, currEvent: action.event };

    case GET_CURR_GROUP: {
      // let groupInfo = { ...state.group };
      let groupInfo = action.groupId;
      console.log("from reducer",groupInfo)
        return { ...state, group:groupInfo};
    }

    default:
      return state;
  }
};

export default eventsReducer;
