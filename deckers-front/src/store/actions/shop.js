import {
  SET_AVAILABLE_CHESTS
} from "../actionTypes";
// import {
//   apiCall
// } from "../../services/api";

export const setAvailableChests = (chests) => ({
  type: SET_AVAILABLE_CHESTS,
  chests: chests
});

// export const getChests = () => {
//   return dispatch => {
//     console.log("getChests");
//     return apiCall("GET", "/chests")
//       .then(res => {
//         dispatch(getShopContent(res))
//       })
//       .catch(res => {
//         console.log("Something went wrong with getting shop content");
//       })
//   };
// };