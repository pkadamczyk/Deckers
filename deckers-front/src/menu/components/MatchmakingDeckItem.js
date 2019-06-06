import React, {Component} from 'react';
import MatchmakingDeckSlot from './MatchmakingDeckSlot';
import {connect} from 'react-redux';
import {chooseDeck} from '../../store/actions/matchmaking';

class MatchmakingDeckItem extends Component{
    render(){
        const {deck, chooseDeck} = this.props;
        let DeckSlots = deck.cards.map( (card, index) => (
            <MatchmakingDeckSlot 
                key={card._id + " " +index}
                deckSlot={card}
                deckSlotNumber={index}
            />
        ));
        return(
            <div className="mm-deck-item" onClick={()=>chooseDeck(deck._id)}>
                <h1 className="mm-deck-name">{deck.name}</h1>
                <hr/>
                {DeckSlots}
            </div>
        )
    }
}
function mapStateToProps(state){
    return{
        decks : state.currentUser.user.decks,
    }
}

export default connect(mapStateToProps, {chooseDeck}) (MatchmakingDeckItem);
