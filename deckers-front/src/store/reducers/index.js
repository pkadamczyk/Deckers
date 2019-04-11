import { combineReducers } from "redux";
import matchMaking from './matchMaking';
import shop from './shop';


const rootReducer = combineReducers({
    matchMaking,
    shop
  
});

export default rootReducer;
