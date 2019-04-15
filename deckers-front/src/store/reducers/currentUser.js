import { SET_CURRENT_USER, UPDATE_USER_AFTER_CHEST_PURCHASE } from "../actionTypes";

const DEFAULT_STATE = {
  isAuthenticated: false, // hopefully be true, when logged in
  user: {} // all the user info when logged in
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        // turn empty object into false or if there are keys, true
        isAuthenticated: !!Object.keys(action.user).length,
        user: action.user
      };
      case UPDATE_USER_AFTER_CHEST_PURCHASE:
        let updatedUser = state.user;
        updatedUser.cards = action.currentCards;
        updatedUser.currency = action.currency;
        return {
          ...state,
          user:updatedUser
        }
    default:
      return state;
  }
};
