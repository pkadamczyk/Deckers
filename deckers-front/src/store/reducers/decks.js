import {SELECT_RACE} from "../actionTypes";

const DEFAULT_STATE = {race:"Dwarves"};
  
  export default (state = DEFAULT_STATE, action) => {
      switch (action.type){
        case SELECT_RACE:
          return {...state, race:action.race};
        default:
          return state;
      }
    };