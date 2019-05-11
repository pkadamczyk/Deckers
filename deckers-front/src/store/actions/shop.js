import {SET_AVAILABLE_CHESTS} from "../actionTypes";
import {apiCall} from "../../services/api";
import {updateUserAfterChestPurchase} from './auth';

export const setAvailableChests = (chests) => ({
  type: SET_AVAILABLE_CHESTS,
  chests: chests
});

export const buyChest = (usr_id, chest_name) => {
  return dispatch => {
    return apiCall("POST", `http://localhost:8080/${usr_id}/shop/buy/${chest_name}`)
      .then(res => {
        dispatch(updateUserAfterChestPurchase(res))
      })
      .catch(res => {
        console.log("Something went wrong with getting shop content");
      })
  };
};