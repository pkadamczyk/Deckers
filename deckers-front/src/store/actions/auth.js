import { apiCall, setTokenHeader } from "../../services/api";
import { SET_CURRENT_USER, UPDATE_USER_AFTER_CHEST_PURCHASE, UPDATE_USER_AFTER_DECK_CREATION } from "../actionTypes";
import {setAvailableChests} from './shop';

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user
  };
}

export function setAuthorizationToken(token) {
  setTokenHeader(token);
}

export function updateUserAfterDeckCreation(res) {
  return({
    type: UPDATE_USER_AFTER_DECK_CREATION,
    currentDecks: res.decks,
  })
}

export function updateUserAfterChestPurchase(res){
  
  return({
    type: UPDATE_USER_AFTER_CHEST_PURCHASE,
    currency: res.currency,
    currentCards: res.currentCards
  })
}

export function logout() {
  return dispatch => {
    localStorage.clear();
    setAuthorizationToken(false);
    dispatch(setCurrentUser({}));
  };
}

export function authUser(type, userData) {
  return dispatch => {
    // wrap our thunk in a promise so we can wait for the API call
    return new Promise((resolve, reject) => {
      return apiCall("post", `http://localhost:8080/${type}`, userData)
        .then(({ token, availableChests, ...user }) => {
          localStorage.setItem("jwtToken", token);
          setAuthorizationToken(token);
          dispatch(setCurrentUser(user.user));
          dispatch(setAvailableChests(availableChests));
          resolve(); // indicate that the API call succeeded
        })
        .catch(err => {
          reject(); // indicate the API call failed
        });
    });
  };
}
