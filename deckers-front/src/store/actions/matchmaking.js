import { apiCall } from "../../services/api";
import { connectedToGame, reconnectedToGame } from './game';
import { CHOOSE_DECK, ABANDONED_GAME } from '../actionTypes';

export const chooseDeck = (deck_id) => ({
    type: CHOOSE_DECK,
    deck_id: deck_id
});

export function connectToGame(game_id, user_id, deck_id, history) {
    return dispatch => {
        // wrap our thunk in a promise so we can wait for the API call
        return new Promise((resolve, reject) => {
            return apiCall("post", `/api/${user_id}/game/${game_id}`, { deck_id })
                .then(res => {
                    console.log(res);
                    dispatch(connectedToGame(res));
                    history.push("/gameplay")
                })
                .catch(err => {
                    reject(); // indicate the API call failed
                });
        });
    };
}

export const gameAbandoned = (res) => {
    return {
        type: ABANDONED_GAME,
        res
    };
}

export function abandonGame(user_id) {
    return dispatch => {
        return new Promise((resolve, reject) => {
            return apiCall("post", `/api/${user_id}/game/abandon`, {})
                .then(res => {
                    dispatch(gameAbandoned(res));
                })
                .catch(err => {
                    reject(); // indicate the API call failed
                });
        });
    };
}

export function reconnectToGame(user_id, history) {
    return dispatch => {
        return new Promise((resolve, reject) => {
            return apiCall("post", `/api/${user_id}/game/reconnect`, {})
                .then(res => {
                    dispatch(reconnectedToGame(res));
                    history.push("/gameplay")
                })
                .catch(err => {
                    reject(); // indicate the API call failed
                });
        });
    };
}

