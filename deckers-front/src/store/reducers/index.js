import { combineReducers } from "redux";
import matchMaking from './matchMaking';
import shop from './shop';
import currentUser from './currentUser';


const rootReducer = combineReducers({
    matchMaking,
    shop,
    currentUser
  
});

export default rootReducer;
