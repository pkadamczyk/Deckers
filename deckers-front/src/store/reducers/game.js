// import { CONNECTED_TO_GAME } from "../actionTypes";
import { REORDER_CARDS_ON_HAND } from "../actionTypes"

const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

const DEFAULT_STATE = {
    cardsOnBoard: getItems(4),
    cardsOnHand: getItems(5, 10)
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        // case CONNECTED_TO_GAME:
        //     return action.gameInfo;
        case REORDER_CARDS_ON_HAND:
            const result = Array.from(action.list);
            const [removed] = result.splice(action.startIndex, 1);
            result.splice(action.endIndex, 0, removed);
            return { ...state, cardsOnHand: result }

        default:
            return state;
    }
};


