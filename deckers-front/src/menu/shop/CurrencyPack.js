import React, { Component } from 'react';

import styled from "styled-components";
import chestItemImg from '../../graphic/background_04.png'
import chestItemNameImg from '../../graphic/title_02.png'
import chestItemNameImgImg from '../../graphic/shop_chest_01.PNG'
import chestItemButtonImg from '../../graphic/button_long_04.png'

import goldImg from '../../graphic/icon_currency_gold.PNG'
import gemImg from '../../graphic/icon_currency_gem.PNG'

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

    color:${props => props.disabled ? "red" : "white"};
    font-size: 24px;

    width:45%;
    height: 40px;

    cursor: ${props => !props.disabled ? "pointer" : "inherit"};

    margin: 0 auto;
    padding: 1% 0;
    position: relative;
    bottom: 10px;
`

const CurrencyImg = styled.span`
    background-image: url(${props => props.imageURL});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

    padding-left: 1.5rem;

    height: 30px;
    margin-left: 3%;
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

    }

    render() {
        const { item, isAffordable, handleClick } = this.props;
        const { amount, name, price, currency } = item

        const imageUrl = images.get(item.imageID)
        const currencyImgs = [goldImg, gemImg]
        const priceImgUrl = currencyImgs[price.currency]
        const rewardImgUrl = currencyImgs[currency]

        return (
            <Wrapper isAffordable={isAffordable}>
                <NameTag >{name}</NameTag>

                <ItemImgWrapper>
                    <ItemImg imageURL={imageUrl} />
                </ItemImgWrapper>

                <ListWrapper>
                    <Row><Guaranteed>{amount} <CurrencyImg imageURL={rewardImgUrl} /></Guaranteed></Row>
                </ListWrapper>

                <Button onClick={handleClick} disabled={!isAffordable} >
                    {price.amount}<CurrencyImg imageURL={priceImgUrl} />
                </Button>
            </Wrapper>
        );
    }
}

export default CurrencyPack;