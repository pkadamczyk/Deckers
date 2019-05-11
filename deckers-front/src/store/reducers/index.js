import { combineReducers } from "redux";
import shop from './shop';
import currentUser from './currentUser';
import decks from './decks';
import game from './game';
import matchmaking from './matchmaking';


const rootReducer = combineReducers({
    shop,
    currentUser,
    decks,
    game,
    matchmaking
  
});

export default rootReducer;
