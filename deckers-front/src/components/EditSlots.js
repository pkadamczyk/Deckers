import React, {Component} from 'react';

class EditSlots extends Component{
    render(){
        const {deckSlot, deckSlotNumber, removeCardFromDeck} = this.props;
        return(
            <div className="deckSlot">
                <div className="row">
                    <div className="col-10 card-name"><p>{deckSlot.name}</p></div><button onClick={() => 
                {removeCardFromDeck(deckSlotNumber)}} className="btn btn-danger cancel-card col-2"
                >X</button></div>
            </div>
        )
    }
}
export default EditSlots;