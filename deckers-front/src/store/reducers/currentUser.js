import { SET_CURRENT_USER, UPDATE_USER_AFTER_CHEST_PURCHASE, UPDATE_USER_AFTER_DECK_CREATION } from "../actionTypes";

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
        //let userCards = state.user.cards.filter(card => card!==0);
        updatedUser.cards = action.currentCards;
        updatedUser.currency = action.currency;
        return {
          ...state,
          user:updatedUser
        }
        case UPDATE_USER_AFTER_DECK_CREATION:
        let anotherUpdatedUser = state.user;
        anotherUpdatedUser.decks = action.currentDecks;
        return {
          ...state,
          user:anotherUpdatedUser
        }
    default:
      return state;
  }
};
