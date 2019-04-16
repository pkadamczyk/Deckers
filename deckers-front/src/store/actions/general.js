import {REFRESH_CURRENCY} from "../actionTypes";

export const refreshCurrency = (currency) => ({
    type: REFRESH_CURRENCY,
    currency: currency
  });