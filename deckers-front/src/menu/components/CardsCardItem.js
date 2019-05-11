import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addCardToDeck } from '../../store/actions/decks';

class CardsCardItem extends Component {
    render() {
        const { card, currentState, addCardToDeck, deckIsFull } = this.props;
        const races = ['Dwarf', 'Forsaken', 'The Order', 'Skaven']
        return (
            <div className=" card-item m-2">
                <div className="card-item-cost">
                    <p>{card.card.stats[0].cost}</p>
                </div>
                <div className="card-item-name">
                    <p>{card.card.name}</p>
                </div>
                <div className="card-item-race">
                    <p>{races[card.card.race]}</p>
                </div>
                {/* <p>Amount: {card.amount}</p> */}
                <div className="card-item-stats">
                    <span className="card-stats-damage"><p>{card.card.stats[0].damage}</p></span>
                    <span className="card-stats-health"><p>{card.card.stats[0].health}</p></span>
                </div>
                <div className="card-item-description">
                    {/* //<p>{card.card.role}</p> */}
                    <p>{card.card.description}</p>
                </div>

                {(currentState === "creating" || currentState === "editing") && (deckIsFull === false) && (
                    <button onClick={(e) => { addCardToDeck(card.card) }} className="btn addCardToDeck">Add to deck</button>
                )}
            </div>
        )
    }

}

function mapStateToProps(state) {
    return {
        currentState: state.decks.currentState,
        deckIsFull: state.decks.full
    }
}

export default connect(mapStateToProps, { addCardToDeck })(CardsCardItem);