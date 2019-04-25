import {CREATE_NEW_DECK, ADD_CARD_TO_DECK, CANCEL_DECK_CREATION, REMOVE_CARD_FROM_DECK, EDIT_DECK} from "../actionTypes";

const DEFAULT_STATE = {
  currentState:"idle",
  cards:[],
};
  
  export default (state = DEFAULT_STATE, action) => {
      switch (action.type){
        case CREATE_NEW_DECK:
        return {...state, currentState:"creating", cards:[]}
        case CANCEL_DECK_CREATION:
          return {currentState:"idle", cards:[]}
        case ADD_CARD_TO_DECK:
          //STUPID, but! it makes CardList component rerender and updates cards.
          //Temporary (hope so)
          let updatedCards = state.cards.filter(card => card!==0);
          updatedCards.push(action.card);
          return {...state, cards:updatedCards}
        case REMOVE_CARD_FROM_DECK:
          let cardsAfterDeletion = state.cards.filter( (card,index) => index!==action.slot)
          return{...state, cards:cardsAfterDeletion}
        case EDIT_DECK:
          let currentCards = action.cards;
          let currentName = action.name;
          let deck_id = action.deck_id;
          return{...state, currentState:"editing", cards:currentCards, name:currentName, deck_id:deck_id}
        default:
          return state;
      }
    };