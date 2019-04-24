import {CREATE_NEW_DECK, ADD_CARD_TO_DECK, CANCEL_DECK_CREATION, REMOVE_CARD_FROM_DECK, EDIT_DECK} from "../actionTypes";
import {apiCall} from "../../services/api";
import {updateUserAfterDeckCreation} from './auth';

export const createNewDeck = () => ({
  type: CREATE_NEW_DECK
});

export const addCardToDeck = (card) => ({
  type: ADD_CARD_TO_DECK,
  card:card
});

export const cancelDeckCreation = () => ({
  type: CANCEL_DECK_CREATION
});

export const editDeck = (cards) => ({
  type: EDIT_DECK,
  cards:cards
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