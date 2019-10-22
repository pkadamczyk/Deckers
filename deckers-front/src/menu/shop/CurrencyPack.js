import React, { Component } from 'react';

import styled from "styled-components";
import chestItemImg from '../../graphic/background_04.png'
import chestItemNameImg from '../../graphic/title_02.png'
import chestItemNameImgImg from '../../graphic/shop_chest_01.PNG'
import chestItemButtonImg from '../../graphic/button_long_04.png'
import goldImg from '../../graphic/icon_currency_gold.PNG'

import cardsRandom from '../../graphic/cards_random.svg'
import cardsCommon from '../../graphic/cards_common.svg'
import cardsRare from '../../graphic/cards_rare.svg'
import cardsEpic from '../../graphic/cards_epic.svg'
import cardsLegendary from '../../graphic/cards_legendary.svg'

import images from "../../graphic/shop_items"

const Wrapper = styled.div`
    position: relative;
    text-align: center;
    width: 30%;
    height: 100%;

    margin: 0 2%;
    color:white;
    background: #b5b5b5;
    border-radius: 20px;
    transition: all 0.3s;

    display:flex;
    flex-direction: column;

    opacity: ${props => props.isAffordable ? "1" : "0.65"}
`

const NameTag = styled.h4`
    background-image: url(${chestItemNameImg});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    border-radius: 15px;
`
const ItemImg = styled.div`
    background-image: url(${props => props.imageURL});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;

    width: 70%;
    height: 100%;
    margin: 0 15%;
`
const ItemImgWrapper = styled.div`
    background: #eee;

    width: 106%;
    height: 120px;
    margin: 0;
    padding: 3% 0;

    position: relative;
    left: -3%;

    border-radius: 10px;
`

const Button = styled.button`
    border:none;
    border-radius: 10px;

    color:white;
    font-size: 1rem;

    width:45%;

    cursor: ${props => props.isAffordable ? "pointer" : "inherit"};

    margin: 0 auto;
    position: relative;
    bottom: 10px;
`

const GoldImg = styled.span`
    background-image: url(${goldImg});
    background-size: contain;
    background-repeat: no-repeat;
    padding-left: 2.5rem;
    font-size: 1.6rem;

    height: 30px;
    margin-left: 5%;
`

const ListWrapper = styled.div`
    margin: 12px;
`

const Guaranteed = styled.div`
    height: 40px;
    width: 90%;
    background: #48BAFF;
    border-radius: 5px;

    margin: 7px auto;
    padding: 0 8px;

    display:flex;
    align-items: center;
    justify-content: center;
`

const Row = styled.div`
    display: flex;
    width: 90%;
    margin: auto;

    flex-wrap: wrap;
    justify-content: space-between;
`

class CurrencyPack extends Component {
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
        const { item, isAffordable } = this.props;
        const { amount, name, currency } = item

        const imageUrl = images.get(item.imageID)

        return (
            <Wrapper isAffordable={isAffordable}>
                <NameTag >{name}</NameTag>

                <ItemImgWrapper>
                    <ItemImg imageURL={imageUrl} />
                </ItemImgWrapper>

                <ListWrapper>
                    <Row><Guaranteed>{amount} <GoldImg /></Guaranteed></Row>
                </ListWrapper>

                <Button onClick={this.handleOnClick} disabled={!isAffordable}>
                    <GoldImg>{amount}</GoldImg>
                </Button>
            </Wrapper>
        );
    }
}

export default CurrencyPack;