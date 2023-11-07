
const GROUP_ADD = "group/GROUP_ADD"

export const groupAdd = (group) => {
  return {
    type:ADD_GROUP,
    group
  }
}


export const groupReducer = (state = [], action) => {
    switch (action.type) {
        case 'ADD_Group':
          return [...state, action.group];
        default:
          return state;
      }
    };
