import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addCardToDeck } from '../../store/actions/decks';
import {cL, tC} from 'react-classlist-helper';

class CardsCardItem extends Component {
    render() {
        const { card, currentState, addCardToDeck, deckIsFull } = this.props;
        const races = ['Dwarf', 'Forsaken', 'TheOrder', 'Skaven']
        const classes = ['Warrior','Hunter','Assasin','Mage','Knight','Priest','Warlock','Merchant', 'Spell'];
        const coloredSquare = `card-item-cost-${races[card.card.race].toLowerCase()}`;
        return (
            <div className="col-3 col-3-card-fixed">
                <div className="card-wrapper">
                    <div className="card-item-bg m-2">
                        <div className=" card-item">

                            {/* <div className="card-item-portrait"> */}
                            <div className="card-title">
                                <div className={cL("card-item-cost", coloredSquare)}>
                                    <p>{card.card.stats[0].cost}</p>
                                </div>
                                <p>{races[card.card.race]} {classes[card.card.role]}</p>
                            </div>

                            {/* <div className="card-item-class-icon">
                    <p>{card.card.stats[0].cost}</p>
                </div>
                <div className="card-item-race-icon">
                    <p>{card.card.stats[0].cost}</p>
                </div> */}
                            {/* </div> */}

                            <div className="card-item-name">
                                <p><strong>{card.card.name}</strong></p>
                            </div>
                            {/* <div className="card-item-race">
                    <p>{races[card.card.race]}</p>
                </div> */}
                            {/* <p>Amount: {card.amount}</p> */}
                            <div className="card-item-stats">
                                <span className="card-stats-damage"><p>{card.card.stats[0].damage}</p></span>
                                <span className="card-stats-health"><p>{card.card.stats[0].health}</p></span>
                            </div>
                            <div className="card-item-description">
                                {/* //<p>{card.card.role}</p> */}
                                {/* 
                                //////////COMMENTED DUE TO TOO LONG DESCRIPTION///////////
                                <p>{card.card.description}</p> 
                                */}
                            </div>

                            {(currentState === "creating" || currentState === "editing") && (deckIsFull === false) && (
                                <button onClick={(e) => { addCardToDeck(card.card) }} className="btn addCardToDeck">Add to deck</button>
                            )}
                        </div>


                    </div>
                </div>
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