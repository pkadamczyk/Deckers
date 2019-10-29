import { SET_SHOP_DATA, UPDATE_SHOP_STATE } from "../actionTypes";

export const SHOP_STATE = {
    IDLE: 1,
    BUSY: 2,
}

const DEFAULT_STATE = {
    chests: [],
    currencyPacks: [],
    shopState: SHOP_STATE.IDLE,
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SET_SHOP_DATA:
            const { availableChests, currencyPacks } = action.data;

            return { ...state, chests: availableChests, currencyPacks };

        case UPDATE_SHOP_STATE:
            const { newState, data } = action
            if (data) return { ...state, shopState: newState, lastDrop: data.newCards }

            return { ...state, shopState: newState, lastDrop: null }

        default:
            return state;
    }
};