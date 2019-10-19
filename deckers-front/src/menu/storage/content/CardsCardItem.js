import React, { Component } from 'react';

import styled from "styled-components"
import cardItemBackground from '../../../graphic/card_front_01.png';

import cardCostBoxSkaven from '../../../graphic/race_filter_01.png';
import cardCostBoxDwarf from '../../../graphic/race_filter_02.png';
import cardCostBoxForsaken from '../../../graphic/race_filter_04.png';
import cardCostBoxOrder from '../../../graphic/race_filter_03.png';
import { RACE_LIST, CLASS_LIST } from './CardsContent';
import { STORAGE_STATE } from '../../../store/reducers/storage';

import images from "../../../graphic/card_portraits/forsaken"

const Card = styled.div`
    height:255px;
    width:173px;
    background-image: url(${cardItemBackground}) !important;
    background-repeat: no-repeat;
    background-size: contain;
    color:white;
`

const CostBox = styled.div`
    background: ${props => `url(${props.background}) no-repeat`};
    background-size: contain;

    display: inline-block;
    font-weight: bold;
    width: 18%;
    padding-left: 11px;
    padding-top: 3px;
`

const Wrapper = styled.div`
    margin: 0 2%;
    background-image: url(${props => props.imageURL});
    background-repeat: no-repeat;
    background-size: contain;

    position: relative;
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

    position: absolute;
    bottom: 20px;
    left: 10px;
    width: 88%;
    font-size: 21px;
`
const Class = styled.div`
    font-size: 12px;

    position: relative;
    top: 15px;
`

const Description = styled.div`
    text-align: center;
    width: 100%;
    height: 55px;

    position: absolute;
    bottom: 32px;
    font-size: 12px;
`

const CenterText = styled.div`
    width:74%;
    margin: auto;
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
        const imageURL = images.get(card.imageID)

        return (
            <Wrapper imageURL={imageURL}>

                <Card>
                    <CostBox background={costBoxBackground}>
                        <p>{card.stats[dbCard.level].cost}</p>
                    </CostBox>

                    {currentState !== STORAGE_STATE.IDLE && (isDeckFull === false) && (
                        <Button onClick={this.handleOnClick}>Add to deck</Button>
                    )}

                    <Name>{card.name}</Name>

                    <Description><CenterText>{card.description}</CenterText></Description>

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