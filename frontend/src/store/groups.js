import { Dispatch } from "react";

// taken from forms practice and modified
export const LOAD_GROUPS = "groups/LOAD_GROUPS";
export const CREATE_GROUP = "groups/CREATE_GROUP";
export const UPDATE_GROUP = "groups/UPDATE_GROUP";
export const DELETE_GROUP = "groups/DELETE_GROUP";
export const DETAIL_GROUP = "groups/DETAIL_GROUP";
export const GET_NUM_EVENTS = "groups/GET_NUM_EVENTS";

/**  Action Creators: */
export const loadGroups = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});

export const createGroup = (group) => ({
  type: CREATE_GROUP,
  group,
});

export const updateGroup = (group) => ({
  type: UPDATE_GROUP,
  group,
});

export const deleteGroup = (groupId) => ({
  type: DELETE_GROUP,
  groupId,
});

export const detailGroup = (group) => ({
  type: DETAIL_GROUP,
  group,
});

export const getNumEvents = (groupId) => ({
  type: GET_NUM_EVENTS,
  groupId,
});

/** Thunk Action Creators: */

export const getGroups = (groups) => async (dispatch) => {
  const res = await fetch("/api/groups");
  const data = await res.json();
  res.data = data;
  if (res.ok) {
    // const groups = await res.json()
    dispatch(loadGroups(data.Groups));
  } else {
    throw res;
  }
};
export const getGroupDetails = (groupId) => async (dispatch) => {
  const res = await fetch(`/api/groups/${groupId}`);
  const data = await res.json();
  res.data = data;
  if (res.ok) {
    // const groups = await res.json()
    dispatch(detailGroup(data));
  } else {
    throw res;
  }
};

export const getNumberEvents = (groupId) => async (dispatch) => {
  const res = await fetch(`/api/groups/${groupId}/events`);
  const data = await res.json();
  res.data = data;
  if (res.ok) {
    // const groups = await res.json()
    dispatch(getNumEvents(data));
  } else {
    throw res;
  }
};

/** The reports reducer is complete and does not need to be modified */
const groupsReducer = (
  state = { groups: {}, currGroup: {}, Events: {} },
  action
) => {
  switch (action.type) {
    case LOAD_GROUPS:
      const groupsState = {};
      action.groups.forEach((group) => {
        groupsState[group.id] = group;
      });
      return { ...state, groups: groupsState };

    case CREATE_GROUP: {
      const groups = { ...state.groups };
      groups[action.group.id] = action.group;
      return { ...state, groups };
    }

    case UPDATE_GROUP: {
      const groups = { ...state.groups };
      groups[action.group.id] = action.group;
      return { ...state, groups };
    }
    case DELETE_GROUP:
      const newState = { ...state };
      delete newState[action.groupId];
      return newState;

    case DETAIL_GROUP:
      return { ...state, currGroup: action.group };

    case GET_NUM_EVENTS: {
      let event = { ...state.Events };
      event = action.groupId.Events;
      return { ...state, Events: event };
    }
    
    default:
      return state;
  }
};

export default groupsReducer;
