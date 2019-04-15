import {SET_AVAILABLE_CHESTS} from "../actionTypes";

const DEFAULT_STATE = [];
  
  export default (state = DEFAULT_STATE, action) => {
      switch (action.type) {
        case SET_AVAILABLE_CHESTS:
          return action.chests;
        default:
          return state;
      }
    };