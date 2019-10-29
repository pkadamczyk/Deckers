import { SET_SHOP_DATA, UPDATE_SHOP_STATE } from "../actionTypes";
import { apiCall } from "../../services/api";
import { updateUserAfterPurchase } from './auth';
import { SHOP_STATE } from "../reducers/shop";

export const setShopData = (data) => ({
    type: SET_SHOP_DATA,
    data: data
});

export const updateShopState = (newState, data) => {
    return {
        type: UPDATE_SHOP_STATE,
        newState,
        data
    }
}

export const buyChest = (usr_id, chest_name) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch(updateShopState(SHOP_STATE.BUSY))
            return apiCall("post", `/api/${usr_id}/shop/buy/${chest_name}`)
                .then(res => {
                    dispatch(updateUserAfterPurchase(res))
                    dispatch(updateShopState(SHOP_STATE.BUSY, res))
                }).catch(err => {
                    reject(err); // indicate the API call failed
                });
        }).catch(err => {
            dispatch(updateShopState(SHOP_STATE.IDLE))
        });
    }
}

export const buyShopItem = (usr_id, itemID) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch(updateShopState(SHOP_STATE.BUSY))
            return apiCall("post", `/api/${usr_id}/shop/buy/item/${itemID}`)
                .then(res => {
                    dispatch(updateUserAfterPurchase(res))
                    dispatch(updateShopState(SHOP_STATE.IDLE))
                }).catch(err => {
                    reject(err); // indicate the API call failed
                });
        }).catch(err => {
            dispatch(updateShopState(SHOP_STATE.IDLE))
        });
    }
}