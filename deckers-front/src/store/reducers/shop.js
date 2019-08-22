import { SET_AVAILABLE_CHESTS, UPDATE_SHOP_STATE } from "../actionTypes";

export const SHOP_STATE = {
    IDLE: 1,
    BUSY: 2,
}

const DEFAULT_STATE = {
    chests: [],
    shopState: SHOP_STATE.IDLE,
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SET_AVAILABLE_CHESTS:
            const { chests } = action;

            return { ...state, chests };

        case UPDATE_SHOP_STATE:
            const { newState } = action

            return { ...state, shopState: newState }

        default:
            return state;
    }
};