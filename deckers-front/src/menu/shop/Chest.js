import React, { Component } from 'react';

import styled from "styled-components";
import chestItemImg from '../../graphic/background_04.png'
import chestItemNameImg from '../../graphic/title_02.png'
import chestItemNameImgImg from '../../graphic/shop_chest_01.PNG'
import chestItemButtonImg from '../../graphic/button_long_04.png'
import goldImg from '../../graphic/icon_currency_gold.PNG'

const Wrapper = styled.div`
    background-image: url(${chestItemImg});
    background-repeat: no-repeat;
    background-size: cover;

    text-align: center;
    height: 30rem;
    width: 90%;

    margin: auto 1rem;
    color:white;
    border-radius: 20px;
    padding-top: 3%;
    transition: all 0.3s;

    display:flex;
    justify-content: space-between;

    flex-direction:column;
    opacity: ${props => props.isAffordable ? "1" : "0.65"}
`

const NameTag = styled.h3`
    background-image: url(${chestItemNameImg});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: middle;
`
const ChestImg = styled.div`
    background-image: url(${chestItemNameImgImg});
    background-repeat: no-repeat;
    background-size: cover;

    width:65%;
    height: 45%;
    margin: 1rem auto;
`
const Button = styled.button`
    background-image: url(${chestItemButtonImg}) !important;
    background-repeat: no-repeat;
    background-size: cover;

    border:none;
    color:white;
    font-size: 1rem;

    width:50%;

    background-color: transparent;
    cursor: ${props => props.isAffordable ? "pointer" : "inherit"};

    margin: 0 auto;
`

const GoldImg = styled.span`
    background-image: url(${goldImg});
    background-size: contain;
    background-repeat: no-repeat;
    padding-left: 2.5rem;
    font-size: 1.6rem;
`

const ListWrapper = styled.div`
    margin: 12px;
`

class Chest extends Component {
    constructor(props) {
        super(props)

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        const { handleClick, userId, chest } = this.props;
        const { name } = chest

        handleClick(userId, name)
    }

    render() {
        const { chest, isAffordable } = this.props;
        const { price, name, cardAmount } = chest

        const chestInfo = Object.values(cardAmount).map((amount, i) => {
            return amount !== 0 ? <li key={`${i}${amount}`}>{amount} guaranteed {Object.keys(cardAmount)[i]} cards.</li> : null
        })

        return (
            <Wrapper isAffordable={isAffordable}>
                <NameTag >{name}</NameTag>
                <ChestImg />
                <ListWrapper>
                    <p>This chest contains:</p>
                    <ul>{chestInfo}</ul>
                </ListWrapper>
                <Button onClick={this.handleOnClick} disabled={!isAffordable}>
                    <GoldImg>{price.amount}</GoldImg>
                </Button>
            </Wrapper>
        );
    }
}

export default Chest;