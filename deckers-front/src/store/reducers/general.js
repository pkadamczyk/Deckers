import {REFRESH_CURRENCY} from "../actionTypes";

const DEFAULT_STATE = {};
  
  export default (state = DEFAULT_STATE, action) => {
      switch (action.type){
        case REFRESH_CURRENCY:
          return {...state, currency:action.currency};
        default:
          return state;
      }
    };