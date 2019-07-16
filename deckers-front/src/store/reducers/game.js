// import { CONNECTED_TO_GAME } from "../actionTypes";
import { REORDER_CARDS_ON_HAND, SUMMON_CARD, DRAW_CARD, END_TURN } from "../actionTypes"


const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

const DEFAULT_STATE = {
    cardsOnBoard: getItems(0),
    cardsOnHand: getItems(5, 10),

    isMyTurn: true
};


let OFFSET = 15; // Only for test

export default (state = DEFAULT_STATE, action) => {
    let result;
    let removed;

    switch (action.type) {
        // case CONNECTED_TO_GAME:
        //     return action.gameInfo;
        case REORDER_CARDS_ON_HAND:
            result = Array.from(state.cardsOnHand);
            [removed] = result.splice(action.startIndex, 1);
            result.splice(action.endIndex, 0, removed);
            return { ...state, cardsOnHand: result }

        case SUMMON_CARD:
            const sourceClone = Array.from(state.cardsOnHand);
            const destClone = Array.from(state.cardsOnBoard);
            [removed] = sourceClone.splice(action.droppableSource.index, 1);

            destClone.splice(action.droppableDestination.index, 0, removed);

            let newState = { ...state };
            newState["cardsOnHand"] = sourceClone;
            newState["cardsOnBoard"] = destClone;

            return newState;


        case DRAW_CARD:
            OFFSET++;
            let newCard = {
                id: `item-${OFFSET}`,
                content: `item ${OFFSET}`
            }

            return { ...state, cardsOnHand: [...state.cardsOnHand, newCard] }

        case END_TURN:
            return { ...state, isMyTurn: !state.isMyTurn };
        default:
            return state;
    }
};


