import { combineReducers } from "redux";
import matchMaking from './matchMaking';
import shop from './shop';
import currentUser from './currentUser';
import decks from './decks';


const rootReducer = combineReducers({
    matchMaking,
    shop,
    currentUser,
    decks
  
});

export default rootReducer;
