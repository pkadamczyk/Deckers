import React, {Component} from 'react';

class CardsDeckItem extends Component{
    render(){
        const {deckContent, handleClick, handleDeckDeletion} = this.props;
        return(
            <div className="CardListDeck" >

                <h3 onClick={e => handleClick(deckContent.cards,deckContent.name,deckContent._id)}>
                    {deckContent && deckContent.name}</h3><button onClick={e => handleDeckDeletion(deckContent._id)}
                    className="delete-deck-btn btn btn-danger">X</button>
            </div>
        )
    }
}
export default CardsDeckItem;