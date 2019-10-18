import React, { Component } from 'react';

import styled from "styled-components"
import cardItemBackground from '../../../graphic/card_front_01.png';
import cardTitleBackground from '../../../graphic/title_03.png';
import cardWrapperBackground from '../../../graphic/card_background_01.png';

import cardCostBoxSkaven from '../../../graphic/race_filter_01.png';
import cardCostBoxDwarf from '../../../graphic/race_filter_02.png';
import cardCostBoxForsaken from '../../../graphic/race_filter_04.png';
import cardCostBoxOrder from '../../../graphic/race_filter_03.png';
import card_portrait from '../../../graphic/card_1.png';
import { RACE_LIST, CLASS_LIST } from './CardsContent';
import { STORAGE_STATE } from '../../../store/reducers/storage';

const Card = styled.div`
    height:255px;
    width:173px;
    background-image: url(${cardItemBackground}) !important;
    background-repeat: no-repeat;
    background-size: contain;
    color:white;
`

const CostBox = styled.div`
    background-image: url(${props => props.background});
    background-repeat: no-repeat;
    background-size: contain;

    display: inline-block;
    font-weight: bold;
    width: 18%;
    padding-left: 11px;
    padding-top: 3px;
`

const Wrapper = styled.div`
    margin: 0 2%;
    background-image: url(${card_portrait});
    background-repeat: no-repeat;
    background-size: contain;
`

const Button = styled.button`
    position: relative;
    top:2.8rem;
    left:2.35rem;
`

const Name = styled.div`
    font-size: 14px;

    position: relative;
    top: 102px;

    display: flex;
    justify-content: center;
`

const Stats = styled.div`
    display: flex;
    justify-content: space-between; 

    position: relative;
    top: 141px;
    left: 10px;
    width: 88%;
    font-size: 21px;
`
const Class = styled.div`
    font-size: 14px;

    position: relative;
    top: 9px;
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

    // <p>{Object.keys(RACE_LIST)[card.card.race]} {Object.keys(CLASS_LIST)[card.card.role]}</p>
    render() {
        const { card: dbCard, currentState, isDeckFull } = this.props;
        const { card } = dbCard;

        const costBoxBackgrounds = [cardCostBoxDwarf, cardCostBoxForsaken, cardCostBoxOrder, cardCostBoxSkaven]
        const costBoxBackground = costBoxBackgrounds[card.race]

        return (
            <Wrapper>

                <Card>
                    <CostBox background={costBoxBackground}>
                        <p>{card.stats[dbCard.level].cost}</p>
                    </CostBox>

                    {currentState !== STORAGE_STATE.IDLE && (isDeckFull === false) && (
                        <Button onClick={this.handleOnClick}>Add to deck</Button>
                    )}

                    <Name>{card.name}</Name>

                    <Stats>
                        <div>{card.stats[dbCard.level].damage}</div>
                        <Class>{Object.keys(CLASS_LIST)[card.role]}</Class>
                        <div>{card.stats[dbCard.level].damage}</div>
                    </Stats>
                </Card>
            </Wrapper>
        )
    }
}

export default CardsCardItem;