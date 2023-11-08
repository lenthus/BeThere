import { Dispatch } from "react"
// const GROUP_ADD = "group/GROUP_ADD"

// export const groupAdd = (group) => {
//   return {
//     type:ADD_GROUP,
//     group
//   }
// }


// taken from forms practice and modified
export const LOAD_GROUPS = 'groups/LOAD_GROUPS'
export const CREATE_GROUP = 'groups/CREATE_GROUP'
export const UPDATE_GROUP = 'groups/UPDATE_GROUP'
export const DELETE_GROUP = 'groups/DELETE_GROUP'

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
  type:   UPDATE_GROUP,
  group,
});

export const deleteGroup = (groupId) => ({
  type: DELETE_GROUP,
  groupId,
});

/** Thunk Action Creators: */

export const getGroups = (groups) => async dispatch => {
  const res = await fetch('/api/groups')
  const data =await res.json()
  res.data = data;
  if (res.ok){
    const groups = await res.json()
    dispatch(loadGroups(data.Groups))
  }else{
    throw res
  }
}
// export const deleteReport = (reportId) => async dispatch => {
//   const res = await fetch(`/api/reports/${reportId}`,{
//     method:'DELETE',
//   })

//   if (res.ok){
//     const reports = await res.json()
//     dispatch(removeReport(reportId))

//   }
// }

/** The reports reducer is complete and does not need to be modified */
const groupsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_GROUPS:
      const groupsState = {};
      action.groups.forEach((group) => {
        groupsState[group.id] = group;
      });
      return groupsState;
    case CREATE_GROUP:
      return { ...state, [action.group.id]: action.group };
    case UPDATE_GROUP:
      return { ...state, [action.group.id]: action.group };
    case DELETE_GROUP:
      const newState = { ...state };
      delete newState[action.groupId];
      return newState;
    default:
      return state;
  }
};

export default groupsReducer;
