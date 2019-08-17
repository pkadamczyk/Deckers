import React, { Component } from 'react';

import styled from "styled-components";
import chestItemImg from '../../graphic/background_04.png'
import chestItemNameImg from '../../graphic/title_02.png'
import chestItemNameImgImg from '../../graphic/shop_chest_01.PNG'
import chestItemButtonImg from '../../graphic/nav_background_02.png'
import goldImg from '../../graphic/icon_currency_gold.PNG'

const Wrapper = styled.div`
    background-image: url(${chestItemImg});
    background-repeat: no-repeat;
    background-size: cover;
    text-align: center;
    height: 30rem;
    width: 30%;
    margin: 4.5rem 1rem;
    color:white;
    border-radius: 20px;
    padding-top:1.5rem;
    z-index: 996;
    transition: all 0.3s;
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
    width:50%;
    height: 9.6rem;
    margin: 1rem auto;
`
const Button = styled.button`
    background-image: url(${chestItemButtonImg}) !important;
    background-repeat: no-repeat;
    background-size: contain;
    border:none;
    color:white;
    font-size: 1rem;
    width:30%;
    height:7rem;
    padding-bottom: 2.2rem;
    margin-top:0.8rem;
    z-index: 999;
    background-color: transparent;
    cursor: pointer;
`

const GoldImg = styled.span`
    background-image: url(${goldImg});
    background-size: contain;
    background-repeat: no-repeat;
    padding-left: 2rem;
    margin-right: 1rem;
    font-size: 1.6rem;
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
        const { chest } = this.props;
        const { price, name, cardAmount } = chest

        const chestInfo = Object.values(cardAmount).map((amount, i) => {
            return amount !== 0 ? <li>{amount} guaranteed {Object.keys(cardAmount)[i + 1]} cards.</li> : null
        })

        return (
            <Wrapper>
                <NameTag >{name}</NameTag>
                <ChestImg />
                <div>
                    <p>This chest contains:</p>
                    <ul>{chestInfo}</ul>
                </div>
                <Button onClick={this.handleOnClick}>
                    <GoldImg>{price.amount}</GoldImg>
                </Button>
            </Wrapper>
        );
    }
}

export default Chest;