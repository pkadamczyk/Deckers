import { combineReducers } from "redux";
import matchMaking from './matchMaking';
import shop from './shop';
import currentUser from './currentUser';
import general from './general';


const rootReducer = combineReducers({
    matchMaking,
    shop,
    currentUser,
    general
  
});

export default rootReducer;
