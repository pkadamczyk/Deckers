import {CREATE_NEW_DECK, ADD_CARD_TO_DECK} from "../actionTypes";
import {apiCall} from "../../services/api";
import {updateUserAfterDeckCreation} from './auth';

export const createNewDeck = () => ({
  type: CREATE_NEW_DECK
});

export const addCardToDeck = (card, slot) => ({
  type: ADD_CARD_TO_DECK,
  slot:slot,
  card:card
})

export const submitDeck = (usr_id, deckToSend) => {
  return dispatch => {
    console.log(usr_id);
    return apiCall("POST", `http://localhost:8080/${usr_id}/decks/create`, deckToSend)
      .then(res => {
        dispatch(updateUserAfterDeckCreation(res))
        console.log(JSON.stringify(res));
      })
      .catch(res => {
        console.log("Something went wrong with getting shop content");
      })
  };
};