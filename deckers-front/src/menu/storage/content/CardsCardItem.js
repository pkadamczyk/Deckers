import React, { Component } from 'react';

import styled from "styled-components"
import cardItemBackground from '../../../graphic/card_front_01.png';
import cardTitleBackground from '../../../graphic/title_03.png';
import cardWrapperBackground from '../../../graphic/card_background_01.png';

import cardCostBoxSkaven from '../../../graphic/race_filter_01.png';
import cardCostBoxDwarf from '../../../graphic/race_filter_02.png';
import cardCostBoxForsaken from '../../../graphic/race_filter_04.png';
import cardCostBoxOrder from '../../../graphic/race_filter_03.png';
import { RACE_LIST, CLASS_LIST } from './CardsContent';

const CardItem = styled.div`
    height:255px;
    width:173px;
    background-image: url(${cardItemBackground}) !important;
    background-repeat: no-repeat;
    background-size: contain;
    color:white;
`

const CardTitle = styled.div`
    background-image: url(${cardTitleBackground});
    background-repeat: no-repeat;
    background-size: contain;

    display: flex;
`

const CardCostBox = styled.div`
    background-image: url(${props => props.background});
    background-repeat: no-repeat;
    background-size: contain;

    display: inline-block;
    width: 15%;
    padding-left: 0.5rem;
    margin-right: 0.5rem;
`

const CardWraper = styled.div`
  background-image: url(${cardWrapperBackground});
  background-repeat: no-repeat;
  background-size: contain;
`

const Button = styled.button`
    position: relative;
    top:2.8rem;
    left:2.35rem;
`

class CardsCardItem extends Component {
    constructor(props) {
        super(props);

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        const { card, addCardToDeck } = this.props;

        addCardToDeck(card.card)
    }

    render() {
        const { card, currentState, isDeckFull } = this.props;

        const costBoxBackgrounds = [cardCostBoxDwarf, cardCostBoxForsaken, cardCostBoxOrder, cardCostBoxSkaven]
        const costBoxBackground = costBoxBackgrounds[card.card.race]

        return (
            <CardWraper>

                <CardItem>
                    <CardTitle>
                        <CardCostBox background={costBoxBackground}>
                            <p>{card.card.stats[0].cost}</p>
                        </CardCostBox>
                        <p>{Object.keys(RACE_LIST)[card.card.race]} {Object.keys(CLASS_LIST)[card.card.role]}</p>
                    </CardTitle>

                    {currentState !== "idle" && (isDeckFull === false) && (
                        <Button onClick={this.handleOnClick}>Add to deck</Button>
                    )}
                </CardItem>
            </CardWraper>
        )
    }
}

export default CardsCardItem;