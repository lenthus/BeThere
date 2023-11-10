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
export const DETAIL_GROUP = 'groups/DETAIL_GROUP'

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

export const detailGroup = (group) => ({
  type:   DETAIL_GROUP,
  group,
});

/** Thunk Action Creators: */

export const getGroups = (groups) => async dispatch => {
  const res = await fetch('/api/groups')
  const data =await res.json()
  res.data = data;
  if (res.ok){
    // const groups = await res.json()
    dispatch(loadGroups(data.Groups))
  }else{
    throw res
  }
}
export const getGroupDetails = (groupId) => async dispatch => {
  const res = await fetch(`/api/groups/${groupId}`)
  const data =await res.json()
  res.data = data;
  if (res.ok){
    // const groups = await res.json()
    dispatch(detailGroup(data))
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
const groupsReducer = (state = {groups:{},currGroup:{}}, action) => {
  switch (action.type) {
    case LOAD_GROUPS:
      const groupsState = {};
      action.groups.forEach((group) => {
        groupsState[group.id] = group;
      });
      return {...state, groups:groupsState};

    case CREATE_GROUP:{
      const groups={...state.groups}
      groups[action.group.id]=action.group
      return { ...state, groups };
    }

    case UPDATE_GROUP:{
      const groups={...state.groups}
      groups[action.group.id]=action.group
      return { ...state, groups };
    }
    case DELETE_GROUP:
      const newState = { ...state };
      delete newState[action.groupId];
      return newState;
    case DETAIL_GROUP:
      return {...state, currGroup:action.group}
    default:
      return state;
  }
};

export default groupsReducer;
