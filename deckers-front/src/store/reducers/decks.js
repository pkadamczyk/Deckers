import {CREATE_NEW_DECK, ADD_CARD_TO_DECK} from "../actionTypes";

const DEFAULT_STATE = {
  currentState:"idle",
  cards:[],
  nextAvailableSlot:0
};
  
  export default (state = DEFAULT_STATE, action) => {
      switch (action.type){
        case CREATE_NEW_DECK:
          return {...state, currentState:"creating"};
        case ADD_CARD_TO_DECK:{
          let updatedCards = state.cards;
          updatedCards[action.slot] = action.card;
          let nextSlot = state.nextAvailableSlot;
          nextSlot++;
          return {...state, cards:updatedCards, nextAvailableSlot:nextSlot}
        }
        default:
          return state;
      }
    };