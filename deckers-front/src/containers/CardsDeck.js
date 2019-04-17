import React, {Component} from 'react';

class CardsDeck extends Component{
    render(){
        return(
            <div className="CardDeck">
                <h2>Yours decks:</h2>
                <div className="DeckCreationPanel">
                    <button className="btn btn-deck-create">Create new deck</button>
                </div>
            </div>
        )
    }
}

export default CardsDeck;