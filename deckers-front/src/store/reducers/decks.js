import {CREATE_NEW_DECK, ADD_CARD_TO_DECK, CANCEL_DECK_CREATION, REMOVE_CARD_FROM_DECK, EDIT_DECK, FORCE_CARDS_UPDATE} from "../actionTypes";

const DEFAULT_STATE = {
  currentState:"idle",
  cards:[],
  full:false
};
  
  export default (state = DEFAULT_STATE, action) => {
      switch (action.type){
        case CREATE_NEW_DECK:
        return {...state, currentState:"creating", cards:[], full:false}
        case CANCEL_DECK_CREATION:
          return {currentState:"idle", cards:[], full:false}
        case ADD_CARD_TO_DECK:
          //Temporary (hope so)
          let updatedCards = state.cards.filter(card => card!==0);
          updatedCards.push(action.card);
          let isDeckFullonAdd;
          updatedCards.length===10 ? isDeckFullonAdd=true : isDeckFullonAdd=false;
          return {...state, cards:updatedCards, full:isDeckFullonAdd}
        case REMOVE_CARD_FROM_DECK:
          let cardsAfterDeletion = state.cards.filter( (card,index) => index!==action.slot)
          let isDeckFullonRemove;
          cardsAfterDeletion.length===10 ? isDeckFullonRemove=true : isDeckFullonRemove=false;
          return{...state, cards:cardsAfterDeletion, full:isDeckFullonRemove}
        case EDIT_DECK:
          let currentCards = action.cards;
          let currentName = action.name;
          let deck_id = action.deck_id;
          let isDeckFullonEdit;
          currentCards.length===10 ? isDeckFullonEdit=true : isDeckFullonEdit=false;
          return{...state, currentState:"editing", cards:currentCards, name:currentName, deck_id:deck_id, full:isDeckFullonEdit}
        default:
          state.cards.length===10 ? state.full=true : state.full=false;
          return state;
      }
    };