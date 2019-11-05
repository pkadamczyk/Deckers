import React, { Component } from 'react';

import styled from "styled-components";
import { connect } from "react-redux"

import cardReverse from "../../graphic/card_reverse.png"
import { START_CARD_ROTATION, END_CARD_ROTATION } from './HandCard';

const Wrapper = styled.div`
    width: ${props => 110 + (props.cardsAmount * 110) + "px"};
    height: 230px;
    transition: width 0.5s;

    position: absolute;
    left: 0;
    top: 0;

    margin-top: -30px;
    margin-left: 20px;

    display: flex;
    justify-content: center;
`;

const Card = styled.div` 
    margin: 0 8px 0 0;
    width: ${props => 110 + 'px'};
    height: ${props => (110 * 1.4) + 'px'};

    transform: rotate(${props => -props.cardRotation + "deg"});

    background-image: url(${cardReverse});
    background-repeat: no-repeat;
    background-size: contain;

    position:relative;
    left: ${props => props.index * -50 + "px"};
`;

class EnemyHand extends Component {
    render() {
        const { cards } = this.props;
        const cardsAmount = cards.length

        return (
            <Wrapper cardsAmount={cardsAmount}>
                {cards.map((card, index) => {
                    const cardAngle = (-START_CARD_ROTATION + END_CARD_ROTATION) / (cardsAmount - 1);
                    const cardRotation = START_CARD_ROTATION + (cardAngle * index);

                    const uniqueId = '_' + Math.random().toString(36).substr(2, 9);
                    return (
                        <Card
                            cardRotation={cardRotation}
                            key={uniqueId}
                            index={index}
                        />
                    )
                })}
            </Wrapper>
        )
    }
}

function mapStateToProps(state) {
    return {
        cards: state.game.enemyCardsOnHand,
    }
}

export default connect(mapStateToProps)(EnemyHand);