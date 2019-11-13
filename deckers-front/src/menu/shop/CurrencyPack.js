import React, { Component } from 'react';

import styled from "styled-components";

import goldImg from '../../graphic/icon_currency_gold.PNG'
import gemImg from '../../graphic/icon_currency_gem.PNG'

import images from "../../graphic/shop_items"
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
    background: #556574;
    font-size: 35px;

    @media ${device.laptopL} {
        font-size: 40px;
    };
    @media ${device.desktopS} {
        font-size: 50px;
    }
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
        background: ${props => !props.disabled ? "9FD430" : "8FC320"};
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

const CurrencyImg = styled.span`
    background-image: url(${props => props.imageURL});
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

    height: 100px;
    margin-bottom: 8px;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    @media ${device.laptopL} {
        height: 140px;
    };
    @media ${device.desktopS} {
        height: 170px;
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
    justify-content: center;

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

        const isFree = price.amount === 0;

        return (
            <Wrapper isAffordable={isAffordable}>
                <NameTag >{name}</NameTag>

                <ItemImgWrapper>
                    <ItemImg imageURL={imageUrl} />
                </ItemImgWrapper>

                <ListWrapper>
                    <Row><Guaranteed>{amount} <CurrencyImg imageURL={rewardImgUrl} /></Guaranteed></Row>

                    <Button onClick={handleClick} disabled={!isAffordable} >
                        {isFree ? "Free" : (<>{price.amount} <CurrencyImg imageURL={priceImgUrl} /> </>)}
                    </Button>
                </ListWrapper>


            </Wrapper>
        );
    }
}

export default CurrencyPack;