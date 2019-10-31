import React, { Component } from 'react';

import styled from "styled-components"
import cardItemBackground from '../graphic/card_front_01.png';

import cardCostBoxSkaven from '../graphic/background_race_dwarfs.png';
import cardCostBoxDwarf from '../graphic/background_race_skaven.png';
import cardCostBoxOrder from '../graphic/background_race_order.png';
import cardCostBoxForsaken from '../graphic/background_race_forsaken.png';

import images from "../graphic/card_portraits/forsaken";

import { CARD_WIDTH } from './containers/Board';

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
    font-weight: bold;

    width: 18%;
    height: 13%;

    display: flex;
    align-items: center;
    justify-content: center;
`

const Name = styled.div`
    font-size: ${props => props.size >= 140 ? "15px" : "13px"} ;

    position: absolute;
    top: 57%;
    width: 100%;

    display: flex;
    justify-content: center;
`

const Stats = styled.div`
    display: flex;
    justify-content: space-between; 

    position: absolute;
    bottom: -3px;
    left: 4px;
    width: 92%;
    font-size: 22px;
`
const Description = styled.div`
    text-align: center;
    width: 100%;

    position: absolute;
    top: 70%;
    font-size: ${props => props.size >= 140 ? "11px" : "8px"} ;
`

const CenterText = styled.div`
    width:74%;
    margin: auto;
`

const MarginAuto = styled.div`
    margin: auto;
`


class Card extends Component {
    render() {
        const { card, size = CARD_WIDTH } = this.props;

        const costBoxBackgrounds = [cardCostBoxDwarf, cardCostBoxForsaken, cardCostBoxOrder, cardCostBoxSkaven]
        const costBoxBackground = costBoxBackgrounds[card.race]
        const imageURL = images.get(card.imageID)

        return (
            <Portrait
                imageURL={imageURL}
                size={size}
            >
                <Info>
                    <CostBox background={costBoxBackground}>
                        {card.inGame.stats.cost}
                    </CostBox>
                    <Name size={size}><MarginAuto>{card.name}</MarginAuto></Name>

                    <Description size={size}><CenterText>{card.description}</CenterText></Description>

                    <Stats>
                        {card.inGame.stats.damage > 0 ? <div>{card.inGame.stats.damage}</div> : null}
                        {card.inGame.stats.health > 0 ? <div>{card.inGame.stats.health}</div> : null}
                    </Stats>
                </Info>
            </Portrait>
        )
    }
}

export default Card;