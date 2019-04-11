import {GET_SHOP_CONTENT} from "../actionTypes";

const DEFAULT_STATE = [];
  
  export default (state = DEFAULT_STATE, action) => {
      switch (action.type) {
        case GET_SHOP_CONTENT:
            return action.content;
        default:
          return state;
      }
    };