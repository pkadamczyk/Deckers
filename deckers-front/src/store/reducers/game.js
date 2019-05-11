import { CONNECTED_TO_GAME} from "../actionTypes";

const DEFAULT_STATE = {};
  
  export default (state = DEFAULT_STATE, action) => {
      switch (action.type) {
        case  CONNECTED_TO_GAME:
          return action.gameInfo;
        default:
          return state;
      }
    };