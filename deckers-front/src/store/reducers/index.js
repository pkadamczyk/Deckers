import { combineReducers } from "redux";
import matchMaking from './matchMaking';
import shop from './shop';
import currentUser from './currentUser';
import cards from './cards';


const rootReducer = combineReducers({
    matchMaking,
    shop,
    currentUser,
    cards
  
});

export default rootReducer;
