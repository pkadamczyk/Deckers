import React, {Component} from 'react';

class CardsDeckItem extends Component{
    render(){
        const {deckContent, handleClick, handleDeckDeletion} = this.props;
        return(
            <div className="CardListDeck" >

                <p onClick={e => handleClick(deckContent.cards,deckContent.name,deckContent._id)}>
                    {deckContent && deckContent.name}</p><button onClick={e => handleDeckDeletion(deckContent._id)}
                    className="delete-deck-btn">X</button>
            </div>
        )
    }
}
export default CardsDeckItem;