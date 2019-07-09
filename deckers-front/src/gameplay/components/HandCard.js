import React, { Component } from 'react';

class HandCard extends Component {
    render() {
        // const { card, currentState, addCardToDeck, deckIsFull } = this.props;
        const races = ['Dwarf', 'Forsaken', 'The Order', 'Skaven']
        return (
            <div className="card">
            <div className="card-face">
                <div className="card-back-bg ">
                <div className=" card-face-img">
                <div className="card-label"> 
                    <div className="card-item-cost">
                        {/* <p>{card.card.stats[0].cost}</p> */}
                    </div>
                    <div className="card-item-name">
                        {/* <p>{card.card.name}</p> */}
                    </div>
                    <div className="card-item-race">
                        {/* <p>{races[card.card.race]}</p> */}
                    </div>
                </div>
                {/* <p>Amount: {card.amount}</p> */}
                <div className="card-item-stats">
                    {/* <span className="card-stats-damage"><p>{card.card.stats[0].damage}</p></span>
                    <span className="card-stats-health"><p>{card.card.stats[0].health}</p></span> */}
                </div>
                <div className="card-item-description">
                    {/* //<p>{card.card.role}</p> */}
                    {/* <p>{card.card.description}</p> */}
                </div>
                </div>
            </div>
            </div>
        </div>
        )
    }

}


export default HandCard;