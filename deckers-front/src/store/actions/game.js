import { CONNECTED_TO_GAME} from "../actionTypes";
import {apiCall} from "../../services/api";

export const connectedToGame = (game) => ({
    type: CONNECTED_TO_GAME,
  });

export function connectToGame(game_id, user_id, deck_id) {
    return dispatch => {
    // wrap our thunk in a promise so we can wait for the API call
    return new Promise((resolve, reject) => {
    return apiCall("post", `http://localhost:8080/${user_id}/game/${game_id}`, deck_id)
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