import {
  GET_SHOP_CONTENT
} from "../actionTypes";
import {
  apiCall
} from "../../services/api";

export const getShopContent = (chests) => ({
  type: GET_SHOP_CONTENT,
  content: chests
});

export const getChests = () => {
  return dispatch => {
    console.log("getChests");
    return apiCall("GET", "/chests")
      .then(res => {
        console.log(res);
        dispatch(getShopContent(res))
      })
      .catch(res => {
        console.log("nie git");

      })
  };
};