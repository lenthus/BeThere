import { Dispatch } from "react"
import { csrfFetch } from "./csrf"

// taken from forms practice and modified
export const LOAD_EVENTS = 'events/LOAD_EVENTS'
export const CREATE_EVENT = 'events/CREATE_EVENT'
export const UPDATE_EVENT = 'events/UPDATE_EVENT'
export const DELETE_EVENT = 'events/DELETE_EVENT'
export const GET_CURR_GROUP = 'events/GET_CURR_GROUP'
export const EVENT_DETAILS = 'events/EVENT_DETAILS'
export const REMOVE_GROUP_EVENTS = 'events/REMOVE_GROUP_EVENTS'
export const CREATE_EVENT_IMAGE = 'events/CREATE_EVENT_IMAGE'

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
export const removeGroupEvents = (groupId) =>({
  type: REMOVE_GROUP_EVENTS,
  groupId
})
export const createEventImage = (eventId,img) =>({
  type : CREATE_EVENT_IMAGE,
  eventId,img
})
/** Thunk Action Creators: */

export const getEvents = (events) => async dispatch => {
  const res = await fetch('/api/events')
  const data =await res.json()
  res.data = data;
  if (res.ok){

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

    dispatch(infoGroup(data))
  }else{
    throw res
  }
}
export const createEventMaker = (groupId,event)=>async(dispatch)=>{
  console.log("from the event reducer",event)
  const res= await csrfFetch(`/api/groups/${groupId}/events`,{
    method: "POST",
    body: JSON.stringify(event)
  })

  const data = await res.json()
  if (res.ok) {
    dispatch(createEvent(data));
    return data
  } else {
    throw res;
  }
  }
  export const createEventImageMaker = (eventId,img)=>async(dispatch)=>{
    const res= await csrfFetch(`/api/events/${eventId}/images`,{
      method: "POST",
      body: JSON.stringify(img)
    })
    const data = await res.json()
    if (res.ok) {
      dispatch(createEventImage(data,img));
      return data
    } else {
      throw res;
    }
    }

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
        console.log("action from reducer",action)
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
      let groupInfo = action.groupId;
      console.log("from reducer",groupInfo)
        return { ...state, group:groupInfo};
    }
    case REMOVE_GROUP_EVENTS:{
      const events ={}
      Object.values(state.events).forEach((event)=>{
        if(event.groupId !== action.groupId){
          event[event.id]=event;
        }
      })
      return events
    }
    case CREATE_EVENT_IMAGE:{
      const newState = {...state}
      newState.currEvent.EventImages = []
      newState.currEvent.EventImages.push(action.img.url)
      return newState
    }

    default:
      return state;
  }
};

export default eventsReducer;
