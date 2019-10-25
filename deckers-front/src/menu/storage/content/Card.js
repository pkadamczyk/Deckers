import React, { Component } from 'react';

import styled from "styled-components"
import cardItemBackground from '../../../graphic/card_front_01.png';

import cardCostBoxSkaven from '../../../graphic/background_race_dwarfs.png';
import cardCostBoxDwarf from '../../../graphic/background_race_skaven.png';
import cardCostBoxOrder from '../../../graphic/background_race_order.png';
import cardCostBoxForsaken from '../../../graphic/background_race_forsaken.png';

import { STORAGE_STATE } from '../../../store/reducers/storage';

import images from "../../../graphic/card_portraits/forsaken"

const Wrapper = styled.div`
    margin: 0 1% 10px 1%;
    border: 2px solid transparent;

    :hover{
        border-radius: 10px;
        border: ${props => props.canBePicked ? '2px solid rgba(165, 255, 48, 0.7)' : "2px solid transparent"};

        -webkit-box-shadow:  ${props => props.canBePicked ? "0px -1px 2px 3px rgba(165, 255, 48,0.7)" : "0px -1px 2px 3px transparent"};
        -moz-box-shadow: ${props => props.canBePicked ? "0px -1px 2px 3px rgba(165, 255, 48,0.7)" : "0px -1px 2px 3px transparent"};
        box-shadow: ${props => props.canBePicked ? "0px -1px 2px 3px rgba(165, 255, 48,0.7)" : "0px -1px 2px 3px transparent"};
        cursor: ${props => props.canBePicked ? "pointer" : "inherit"};
    }
`


const Portrait = styled.div`
    background-image: url(${props => props.imageURL});
    background-repeat: no-repeat;
    background-size: contain;

    -webkit-user-select: none;        
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none;

    position: relative;

    height:${props => (props.size * 1.4) + "px"};
    width: ${props => props.size + "px"};

    max-height: 242px;
    max-width: 173px;
`

const Info = styled.div`
    height: 100%;
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

const Name = styled.div`
    font-size: 14px;

    position: absolute;
    top: 59%;
    width: 100%;

    display: flex;
    justify-content: center;
`

const Stats = styled.div`
    display: flex;
    justify-content: space-between; 

    position: absolute;
    bottom: 7px;
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
    top: 70%;
    font-size: 11px;
`

const CenterText = styled.div`
    width:74%;
    margin: auto;
`

const MarginAuto = styled.div`
margin: auto;
`

class Card extends Component {
    constructor(props) {
        super(props);

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        const { card, addCardToDeck, isDeckFull, currentState } = this.props;
        const canBePicked = currentState !== STORAGE_STATE.IDLE && (isDeckFull === false)
        if (!canBePicked) return;

        addCardToDeck(card.card)
    }

    render() {
        const { card: dbCard, currentState, isDeckFull } = this.props;
        const { card } = dbCard;

        const costBoxBackgrounds = [cardCostBoxDwarf, cardCostBoxForsaken, cardCostBoxOrder, cardCostBoxSkaven]
        const costBoxBackground = costBoxBackgrounds[card.race]
        const imageURL = images.get(card.imageID)

        const canBePicked = currentState !== STORAGE_STATE.IDLE && (isDeckFull === false)
        const optimalSize = window.innerWidth * 0.15;
        // 173
        return (
            <Wrapper canBePicked={canBePicked}>
                <Portrait imageURL={imageURL} onClick={this.handleOnClick} size={optimalSize}>
                    <Info>
                        <CostBox background={costBoxBackground}>
                            <p>{card.stats[dbCard.level].cost}</p>
                        </CostBox>
                        <Name><MarginAuto>{card.name}</MarginAuto></Name>

                        <Description><CenterText>{card.description}</CenterText></Description>

                        <Stats>
                            <div>{card.stats[dbCard.level].damage}</div>
                            {/* <Class>{Object.keys(CLASS_LIST)[card.role]}</Class> */}
                            <div>{card.stats[dbCard.level].damage}</div>
                        </Stats>
                    </Info>
                </Portrait>
            </Wrapper>
        )
    }
}

export default Card;