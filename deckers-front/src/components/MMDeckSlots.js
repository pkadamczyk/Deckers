import React, {Component} from 'react';

class MMDeckSlots extends Component{
    render(){
        const {deckSlot, deckSlotNumber, removeCardFromDeck} = this.props;
        return(
            <div className="mm-deckSlot">
                <div className="mm-card-name"><p>{deckSlot.name}</p></div>
            </div>
        )
    }
}
export default MMDeckSlots;