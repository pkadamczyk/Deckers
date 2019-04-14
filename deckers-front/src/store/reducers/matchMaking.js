import { CHOOSE_MODE, FIND_GAME, LEAVE_QUE, ACCEPT_GAME, DISCONNECT_FROM_GAME, ABANDON_GAME, RECONNECT_GAME} from "../actionTypes";

const DEFAULT_STATE = {
  mm_state: "idle",
  mode: "Standard"
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
      case FIND_GAME:
        return { ...state, mm_state: "lookingForGame" };
      case LEAVE_QUE:
        return { ...state, mm_state: "idle" };
      case ACCEPT_GAME:
        return { ...state, mm_state: "playing" };
      case DISCONNECT_FROM_GAME:
        return { ...state, mm_state: "disconnected" };
      case ABANDON_GAME:
        return { ...state, mm_state: "idle" };
      case RECONNECT_GAME:
        return { ...state, mm_state: "playing" };
      case CHOOSE_MODE:
      return {...state, mode:action.mode};
      default:
        return state;
    }
  };