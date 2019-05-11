import { combineReducers } from "redux";
import shop from './shop';
import currentUser from './currentUser';
import decks from './decks';
import game from './game';


const rootReducer = combineReducers({
    shop,
    currentUser,
    decks,
    game
  
});

export default rootReducer;
