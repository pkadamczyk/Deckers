import { START_DECK_CREATION, ADD_CARD_TO_DECK, CANCEL_DECK_CREATION, REMOVE_CARD_FROM_DECK, EDIT_DECK, FORCE_CARDS_UPDATE } from "../actionTypes";

export const STORAGE_STATE = {
    IDLE: 1,
    CREATING: 2,
    EDITING: 3,
}

const DEFAULT_STATE = {
    cards: [],
    isFull: false,
    currentState: STORAGE_STATE.IDLE,

    oldDeckName: null,
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case START_DECK_CREATION:
            return { ...state, currentState: STORAGE_STATE.CREATING, cards: [], isFull: false }

        case CANCEL_DECK_CREATION:
            return { currentState: STORAGE_STATE.IDLE, cards: [], isFull: false }

        case ADD_CARD_TO_DECK:
            return handleAddCardToDeck(state, action)

        case REMOVE_CARD_FROM_DECK:
            return handleRemoveCardFromDeck(state, action)

        case EDIT_DECK:
            return handleEditDeck(state, action);

        default:
            return state;
    }
};

function handleAddCardToDeck(state, action) {
    const { cards } = state
    const { card } = action

    const isFull = [...cards, card].length === 10

    return { ...state, cards: [...cards, card], isFull }
}

function handleRemoveCardFromDeck(state, action) {
    const { cards } = state;
    const { slot } = action

    const filteredCards = cards.filter((c, index) => index !== slot)
    const isFull = filteredCards.length === 10

    return { ...state, cards: filteredCards, isFull }
}

function handleEditDeck(state, action) {
    const { cards, name, deck_id } = action

    const isFull = cards.length === 10

    return { ...state, currentState: STORAGE_STATE.EDITING, cards, oldDeckName: name, deck_id, isFull }
}