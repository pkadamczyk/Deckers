import React, {Component} from 'react';
import MMDeckSlots from '../components/MMDeckSlots'

class DeckItem extends Component{
    render(){
        const {deck} = this.props;
        let DeckSlots = deck.cards.map( (card, index) => (
            <MMDeckSlots 
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
export default DeckItem;