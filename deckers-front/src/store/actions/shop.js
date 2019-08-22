import { SET_AVAILABLE_CHESTS, UPDATE_SHOP_STATE } from "../actionTypes";
import { apiCall } from "../../services/api";
import { updateUserAfterChestPurchase } from './auth';
import { SHOP_STATE } from "../reducers/shop";

export const setAvailableChests = (chests) => ({
    type: SET_AVAILABLE_CHESTS,
    chests: chests
});

export const updateShopState = (newState) => {
    return {
        type: UPDATE_SHOP_STATE,
        newState
    }
}

export const buyChest = (usr_id, chest_name) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch(updateShopState(SHOP_STATE.BUSY))
            return apiCall("post", `http://localhost:8080/${usr_id}/shop/buy/${chest_name}`)
                .then(res => {
                    dispatch(updateUserAfterChestPurchase(res))
                    dispatch(updateShopState(SHOP_STATE.IDLE))
                }).catch(err => {
                    reject(err); // indicate the API call failed
                });
        }).catch(err => {
            dispatch(updateShopState(SHOP_STATE.IDLE))
        });
    }
}