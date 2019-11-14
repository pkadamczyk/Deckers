import React, { Component } from 'react';

import styled from "styled-components"
import cardItemBackground from '../../../graphic/card_front_01.png';

import cardCostBoxSkaven from '../../../graphic/background_race_dwarfs.png';
import cardCostBoxDwarf from '../../../graphic/background_race_skaven.png';
import cardCostBoxOrder from '../../../graphic/background_race_order.png';
import cardCostBoxForsaken from '../../../graphic/background_race_forsaken.png';

import { STORAGE_STATE } from '../../../store/reducers/storage';

import images from "../../../graphic/card_portraits/forsaken"
import { device } from '../../../mediaQueries';

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

    font-weight: bold;
    width: 30px;
    height: 30px;
    text-align: center;

    @media ${device.laptopL} {
        font-size: 19px;
        width: 17%;
        height: 13%;
    }
    @media ${device.desktopS} {
        font-size: 26px;
    }
    @media ${device.desktopS} {
        font-size: 31px;
    }
`

const Name = styled.div`
    font-size: 14px;

    position: absolute;
    top: 59%;
    width: 100%;

    display: flex;
    justify-content: center;

    @media ${device.laptopL} {
        font-size: 22px;
    }
    @media ${device.desktopS} {
        font-size: 28px;
        top: 58%;
    }
`

const Stats = styled.div`
    display: flex;
    justify-content: space-between; 

    position: absolute;
    bottom: 7px;
    left: 10px;
    width: 88%;
    font-size: 21px;

    @media ${device.laptopL} {
        left: 9px;
        font-size: 30px;
    }
    @media ${device.desktopS} {
        left: 15px;
        font-size: 45px;
    }
`

const Description = styled.div`
    text-align: center;
    width: 100%;
    height: 55px;

    position: absolute;
    top: 70%;
    font-size: 13px;

    @media ${device.laptopL} {
        font-size: 18px;
    }
    @media ${device.desktopS} {
        font-size: 20px;
    }
    @media ${device.desktopL} {
        font-size: 22px;
    }
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

        const optimalSize = window.innerWidth < 1400 ? window.innerWidth * 0.13 : window.innerWidth * 0.15
        return (
            <Wrapper canBePicked={canBePicked}>
                <Portrait imageURL={imageURL} onClick={this.handleOnClick} size={optimalSize}>
                    <Info>
                        <CostBox background={costBoxBackground}>
                            {card.stats[dbCard.level].cost}
                        </CostBox>
                        <Name><MarginAuto>{card.name}</MarginAuto></Name>

                        <Description><CenterText>{card.description}</CenterText></Description>

                        <Stats>
                            <div>{card.stats[dbCard.level].damage}</div>
                            <div>{card.stats[dbCard.level].health}</div>
                        </Stats>
                    </Info>
                </Portrait>
            </Wrapper>
        )
    }
}

export default Card;