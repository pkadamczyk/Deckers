import React, {Component} from 'react';

class CardDeckSlots extends Component{
    render(){
        const {deckSlot, deckSlotNumber, removeCardFromDeck} = this.props;
        return(
            // <div className="deckSlot">{deckSlot ? (<div className="row"><div 
            // className="col-10 card-name">{deckSlot.card.name}</div><button onClick={() => 
            //     {removeCardFromDeck(deckSlotNumber)}} className="btn btn-danger cancel-card col-2"
            //     >X</button></div>) : (<div className="card-name">Empty</div>)}
            // </div>
            <div className="deckSlot">
                <div className="row">
                    <div className="col-10 card-name"><p>{deckSlot.card.name}</p></div><button onClick={() => 
                {removeCardFromDeck(deckSlotNumber)}} className="btn btn-danger cancel-card col-2"
                >X</button></div>
            </div>
        )
    }
}
export default CardDeckSlots;