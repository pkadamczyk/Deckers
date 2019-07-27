import { apiCall } from "../../services/api";
import { connectedToGame } from './game';
import { CHOOSE_DECK } from '../actionTypes';

export const chooseDeck = (deck_id) => ({
    type: CHOOSE_DECK,
    deck_id: deck_id
});

export function connectToGame(game_id, user_id, deck_id) {
    return dispatch => {
        // wrap our thunk in a promise so we can wait for the API call
        console.log(`Yo ${deck_id}`)
        return new Promise((resolve, reject) => {
            return apiCall("post", `http://localhost:8080/${user_id}/game/${game_id}`, { deck_id })
                .then(res => {
                    console.log(res);
                    dispatch(connectedToGame(res));
                })
                .catch(err => {
                    reject(); // indicate the API call failed
                });
        });
    };
}