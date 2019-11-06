import { apiCall, setTokenHeader } from "../../services/api";
import { SET_CURRENT_USER, UPDATE_USER_AFTER_PURCHASE, UPDATE_USER_AFTER_DECKS_UPDATE, SET_CONFIG } from "../actionTypes";
import { setShopData } from './shop';
import { chooseDeck } from "./matchmaking";

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user
  };
}

export function setConfig(config) {
  return {
    type: SET_CONFIG,
    config
  };
}


export function setAuthorizationToken(token) {
  setTokenHeader(token);
}

export function updateUserAfterDecksUpdate(res) {
  return ({
    type: UPDATE_USER_AFTER_DECKS_UPDATE,
    currentDecks: res.decks,
  })
}

export function updateUserAfterPurchase(res) {

  return ({
    type: UPDATE_USER_AFTER_PURCHASE,
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
      return apiCall("post", `/api/${type}`, userData)
        .then(({ token, availableChests, currencyPacks, config, ...user }) => {
          localStorage.setItem("jwtToken", token);
          setAuthorizationToken(token);
          dispatch(setShopData({ availableChests, currencyPacks }));
          dispatch(setConfig(config));
          dispatch(chooseDeck(0));
          dispatch(setCurrentUser(user.user));
          resolve(); // indicate that the API call succeeded
        })
        .catch(err => {
          reject(); // indicate the API call failed
        });
    });
  };
}
