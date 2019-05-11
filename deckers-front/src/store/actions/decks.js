import {CREATE_NEW_DECK, ADD_CARD_TO_DECK, CANCEL_DECK_CREATION, REMOVE_CARD_FROM_DECK,
  EDIT_DECK, DELETE_DECK} from "../actionTypes";
import {apiCall} from "../../services/api";
import {updateUserAfterDeckCreation} from './auth';

export const createNewDeck = () => ({
  type: CREATE_NEW_DECK
});

export const addCardToDeck = (card) => ({
  type: ADD_CARD_TO_DECK,
  card:card,
});

export const cancelDeckCreation = () => ({
  type: CANCEL_DECK_CREATION
});

export const editDeck = (cards, name, deck_id) => ({
  type: EDIT_DECK,
  cards:cards,
  name:name,
  deck_id:deck_id
});

export const deleteDeck = (deck_id) => ({
  type: DELETE_DECK,
  deck_id:deck_id
});

export const removeCardFromDeck =(slot) => ({
  type: REMOVE_CARD_FROM_DECK,
  slot:slot
})

export const submitDeck = (usr_id, deckToSend) => {
  return dispatch => {
    console.log(usr_id);
    return apiCall("POST", `http://localhost:8080/${usr_id}/decks/create`, deckToSend)
      .then(res => {
        dispatch(updateUserAfterDeckCreation(res));
        dispatch(cancelDeckCreation());
        console.log(JSON.stringify(res));
      })
      .catch(res => {
        console.log("Something went wrong with getting shop content");
      })
  };
};
export const updateDeck = (usr_id, deck_id, deckToSend) => {
  return dispatch => {
    console.log(usr_id);
    return apiCall("POST", `http://localhost:8080/${usr_id}/decks/${deck_id}?_method=put`, deckToSend)
      .then(res => {
        dispatch(updateUserAfterDeckCreation(res));
        dispatch(cancelDeckCreation());
      })
      .catch(res => {
        console.log("Something went wrong with getting shop content");
      })
  };
};
export const removeDeck = (usr_id, deck_id) => {
  return dispatch => {
    console.log(usr_id);
    return apiCall("POST", `http://localhost:8080/${usr_id}/decks/${deck_id}?_method=delete`, )
      .then(res => {
        dispatch(updateUserAfterDeckCreation(res));
      })
      .catch(res => {
        console.log("Something went wrong with getting shop content");
      })
  };
};