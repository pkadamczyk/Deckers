import React, {Component} from 'react';

class CardListDeck extends Component{
    render(){
        const {deckContent, handleClick} = this.props;
        return(
            <div className="CardListDeck" onClick={e => handleClick(deckContent.cards)}>
                <h3>{deckContent && deckContent.name}</h3>
            </div>
        )
    }
}
export default CardListDeck;