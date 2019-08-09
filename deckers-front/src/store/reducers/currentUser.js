import { SET_CURRENT_USER, UPDATE_USER_AFTER_CHEST_PURCHASE, UPDATE_USER_AFTER_DECKS_UPDATE, UPDATE_USER_AFTER_GAME, ABANDONED_GAME } from "../actionTypes";

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
                user: updatedUser
            }
        case UPDATE_USER_AFTER_DECKS_UPDATE:
            let anotherUpdatedUser = state.user;
            anotherUpdatedUser.decks = action.currentDecks;
            return {
                ...state,
                user: anotherUpdatedUser
            }
        case UPDATE_USER_AFTER_GAME:
            return handleGameOver(state, action)

        case ABANDONED_GAME:
            return handleAbandonedGame(state, action);
        default:
            return state;
    }
};

function handleGameOver(state, action) {
    const { user } = state;
    const { usersData } = action

    const myData = usersData.find(u => u.id === user._id)
    const newCurrency = { ...user.currency, gold: myData.gold }

    const newUser = {
        ...user,
        currency: newCurrency
    }
    return { ...state, user: newUser }
}

function handleAbandonedGame(state, action) {
    return {
        ...state,
        user: {
            ...state.user,
            inGame: false,
        }
    }
}