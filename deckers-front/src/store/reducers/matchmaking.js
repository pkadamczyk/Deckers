import {CHOOSE_DECK} from "../actionTypes";

const DEFAULT_STATE = {deck:""};
  
export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
    case CHOOSE_DECK:
        return {deck: action.deck_id};
    default:
        return state;
    }
};