import { combineReducers } from "redux";
import shop from './shop';
import currentUser from './currentUser';
import storage from './storage';
import game from './game';
import matchmaking from './matchmaking';


const rootReducer = combineReducers({
    shop,
    currentUser,
    storage,
    game,
    matchmaking

});

export default rootReducer;
