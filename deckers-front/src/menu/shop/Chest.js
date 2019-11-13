import React, { Component } from 'react';

import styled from "styled-components";
import chestItemNameImgImg from '../../graphic/shop_chest_01.PNG'
import goldImg from '../../graphic/icon_currency_gold.PNG'

import cardsRandom from '../../graphic/cards_random.svg'
import cardsCommon from '../../graphic/cards_common.svg'
import cardsRare from '../../graphic/cards_rare.svg'
import cardsEpic from '../../graphic/cards_epic.svg'
import cardsLegendary from '../../graphic/cards_legendary.svg'
import { device } from '../../mediaQueries';

const Wrapper = styled.div`
    position: relative;
    text-align: center;
    width: 30%;
    height: 100%;
    
    margin: 0 2%;
    color:white;
    background: #424858;
    border-radius: 20px;
    transition: all 0.3s;

    display:flex;
    flex-direction: column;

    opacity: ${props => props.isAffordable ? "1" : "0.65"};

    -webkit-box-shadow:  ${props => props.isAffordable ? "10px 10px 5px 0px rgba(0,0,0,0.75)" : "none"};
    -moz-box-shadow: ${props => props.isAffordable ? "10px 10px 5px 0px rgba(0,0,0,0.75)" : "none"};
    box-shadow: ${props => props.isAffordable ? "10px 10px 5px 0px rgba(0,0,0,0.75)" : "none"};
`

const NameTag = styled.h2`
    text-shadow: 2px 2px #333;
    margin: 10px 10px 0 10px;

    border-radius: 10px;
    font-size: 35px;
    background: #556574;

    @media ${device.laptopL} {
        font-size: 40px;
    };
    @media ${device.desktopS} {
        font-size: 50px;
    }
`
const ChestImg = styled.div`
    background-image: url(${chestItemNameImgImg});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;

    width: 70%;
    height: 100%;
    margin: 0 15%;
`
const ChestWrapper = styled.div`
    background: #EDE3DE;

    width: calc(100% - 16px);
    height: 120px;
    margin: 4% 8px;
    padding: 3% 0;

    border-radius: 10px;

    @media ${device.laptopL} {
        height: 140px;
    };
    @media ${device.desktopS} {
        height: 160px;
    }
`

const Button = styled.button`
    border:none;
    border-radius: 10px;
    background: #8FC320;

    color:${props => props.disabled ? "red" : "white"};
    font-size: 24px;

    width:45%;
    height: 40px;

    cursor: ${props => !props.disabled ? "pointer" : "inherit"};

    margin: auto;
    transition: all 0.2s;

    :hover{
        background: ${props => !props.disabled ? "#9FD430" : "#8FC320"};
    };
    :focus { outline: none; };

    @media ${device.laptopL} {
        height: 50px;
        font-size: 28px;
    };
    @media ${device.desktopS} {
        height: 60px;
        font-size: 32px;
    }
`

const GoldImg = styled.span`
    background-image: url(${goldImg});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

    padding-left: 1.5rem;

    height: 30px;
    margin-left: 3%;

    @media ${device.laptopL} {
        height: 35px;
        padding-left: 2.5rem;
    };
    @media ${device.desktopS} {
        height: 40px;
        padding-left: 2.5rem;
    }
`

const ListWrapper = styled.div`
    margin: 0 8px;
    padding: 4px 0;
    border-radius: 10px;
    background: #EDE3DE;

    height: 150px;
    margin-bottom: 8px;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    @media ${device.laptopL} {
        height: 195px;
    };
    @media ${device.desktopS} {
        height: 250px;
    }
`

const LootInfo = styled.div`
    height: 40px;
    width: 45%;

    background: #FDFAF8;
    border-radius: 5px;
    color: #555;

    display: flex;
    justify-content: center;
    align-items: center;

    @media ${device.laptopL} {
        height: 50px;
        font-size: 23px;
    };
    @media ${device.desktopS} {
        height: 60px;
        font-size: 27px;
    }
`

const Guaranteed = styled.div`
    height: 40px;
    width: 90%;
    background: #FDFAF8;
    border-radius: 5px;

    margin: auto;
    padding: 0 8px;

    display:flex;
    align-items: center;
    justify-content: space-between;

    color: #555;

    @media ${device.laptopL} {
        height: 50px;
        font-size: 23px;
    };
    @media ${device.desktopS} {
        height: 60px;
        font-size: 27px;
    }
`

const Row = styled.div`
    display: flex;
    width: 90%;
    margin: auto;

    flex-wrap: wrap;
    justify-content: space-between;
`

const SVG = styled.div`
    background-image: url(${props => props.svg});
    background-repeat: no-repeat;
    background-size: contain;
    height: 25px;
    width: 25px; 

    @media ${device.laptopL} {
        height: 30px;
        width: 30px; 
    };
    @media ${device.desktopS} {
        height: 30px;
        width: 30px; 
    }
`

const FlexboxDiv = styled.div`
    display:flex;
    align-items: center;
`

class Chest extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const cardsSvgArray = [cardsRandom, cardsCommon, cardsRare, cardsEpic, cardsLegendary]

        const { chest, isAffordable, handleClick } = this.props;
        const { price, name, cardAmount } = chest

        const chestInfo = Object.values(cardAmount).filter((a, i) => i > 1).map((amount, i) => {
            return amount !== 0 ? <FlexboxDiv key={`${i}${amount}`}>{amount}x <SVG svg={cardsSvgArray[i + 2]} /></FlexboxDiv> : null
        })

        const allCards = Object.values(cardAmount).reduce((a, b) => a + b, 0)

        return (
            <Wrapper isAffordable={isAffordable}>
                <NameTag >{name}</NameTag>
                <ChestWrapper>
                    <ChestImg />
                </ChestWrapper>

                <ListWrapper>
                    <Row><LootInfo> {allCards}x <SVG svg={cardsSvgArray[1]} /> </LootInfo><LootInfo>10x  <GoldImg /></LootInfo></Row>
                    <Guaranteed>
                        Guaranteed:
                        <FlexboxDiv>{chestInfo}</FlexboxDiv>
                    </Guaranteed>

                    <Button onClick={handleClick} disabled={!isAffordable}>
                        {price.amount}<GoldImg />
                    </Button>
                </ListWrapper>
            </Wrapper>
        );
    }
}

export default Chest;