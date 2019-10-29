import React, { Component } from 'react';

import styled from "styled-components"
import cardItemBackground from '../../graphic/card_front_01.png';

import cardCostBoxSkaven from '../../graphic/background_race_dwarfs.png';
import cardCostBoxDwarf from '../../graphic/background_race_skaven.png';
import cardCostBoxOrder from '../../graphic/background_race_order.png';
import cardCostBoxForsaken from '../../graphic/background_race_forsaken.png';

import images from "../../graphic/card_portraits/forsaken"

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

    margin: 0 10px;
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
    left: 8px;
    width: 88%;
    font-size: 21px;
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
    render() {
        const { card } = this.props;

        const costBoxBackgrounds = [cardCostBoxDwarf, cardCostBoxForsaken, cardCostBoxOrder, cardCostBoxSkaven]
        const costBoxBackground = costBoxBackgrounds[card.race]
        const imageURL = images.get(card.imageID)

        const optimalSize = window.innerWidth * 0.14;
        // 173
        return (
            <Portrait imageURL={imageURL} size={optimalSize}>
                <Info>
                    <CostBox background={costBoxBackground}>
                        <p>{card.stats[0].cost}</p>
                    </CostBox>
                    <Name><MarginAuto>{card.name}</MarginAuto></Name>

                    <Description><CenterText>{card.description}</CenterText></Description>

                    <Stats>
                        <div>{card.stats[0].damage}</div>
                        <div>{card.stats[0].health}</div>
                    </Stats>
                </Info>
            </Portrait>
        )
    }
}

export default Card;