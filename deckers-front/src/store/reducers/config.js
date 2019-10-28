import { SET_CONFIG } from "../actionTypes";

const DEFAULT_STATE = {
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SET_CONFIG:
            return handleSetConfig(state, action)

        default:
            return state;
    }
};

function handleSetConfig(state, action) {
    const { config } = action;

    return { ...config };
}