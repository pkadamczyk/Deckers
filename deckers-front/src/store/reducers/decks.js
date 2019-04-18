import {CREATE_NEW_DECK, ADD_CARD_TO_DECK, CANCEL_DECK_CREATION, REMOVE_CARD_FROM_DECK} from "../actionTypes";

const DEFAULT_STATE = {
  currentState:"idle",
  cards:[],
  nextAvailableSlot:0,
  freeSlots:[]
};
  
  export default (state = DEFAULT_STATE, action) => {
      switch (action.type){
        case CREATE_NEW_DECK:
          return {...state, currentState:"creating", cards:[], nextAvailableSlot:0, freeSlots:[]};
        case CANCEL_DECK_CREATION:
          let resetState = state;
          resetState.currentState = "idle";
          resetState.cards = [];
          resetState.nextAvailableSlot = 0;
          return {currentState:"idle", cards:[],nextAvailableSlot:0}
        case ADD_CARD_TO_DECK:
          let updatedCards = state.cards;
          let nextSlot = state.nextAvailableSlot;
          let freeSlotCheck = state.freeSlots;
          let properfreeSlots = state.freeSlots;
          if(freeSlotCheck.length != 0){
            updatedCards[freeSlotCheck[0]] = action.card;
            properfreeSlots.shift();
          }else{
            updatedCards[action.slot] = action.card;
            nextSlot++;
          }
          return {...state, cards:updatedCards, nextAvailableSlot:nextSlot, freeSlots:properfreeSlots}
        case REMOVE_CARD_FROM_DECK:
          state.freeSlots.push(action.slot);
          let cardsAfterDeletion = state.cards;
          cardsAfterDeletion[action.slot] = null;
          return{...state, cards:cardsAfterDeletion}
        default:
          return state;
      }
    };