import React, {Component} from 'react';
import MatchmakingDeckSlot from './MatchmakingDeckSlot'

class MatchmakingDeckItem extends Component{
    render(){
        const {deck} = this.props;
        let DeckSlots = deck.cards.map( (card, index) => (
            <MatchmakingDeckSlot 
                key={card._id + " " +index}
                deckSlot={card}
                deckSlotNumber={index}
            />
        ));
        return(
            <div className="mm-deck-item">
                <h1>{deck.name}</h1>
                <hr/>
                {DeckSlots}
            </div>
            
        )
    }
}
export default MatchmakingDeckItem;