import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chest from './Chest';
import { buyChest, buyShopItem } from '../../store/actions/shop';

import styled from "styled-components"
import { SHOP_STATE } from '../../store/reducers/shop';
import CurrencyPack from './CurrencyPack';

const Row = styled.div`
    display: flex;
    height: 75%;

    width: 96%;
    margin: 0 auto;

    max-width: 950px;
`

const SubTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 96%;
    max-width: 950px;
    margin: 0 auto;

    font-size: 40px;
`

const Blackout = styled.div`
    height: 100%;
    width: 100%;

    position: fixed;
    left:0;
    top:0;
    z-index: 10;
    
    display: flex;

    background: black;
    opacity: 0.65;
`

const BlackoutText = styled.div`
    color:white;
    font-size: 30px;
    margin:auto
`

const Wrapper = styled.div`
    background: #ddd;
    padding: 2% 0;
`

class Shop extends Component {
    constructor(props) {
        super(props)

    }

    render() {
        const { chests, userId, buyChest, buyShopItem, shopState, userCurrency, currencyPacks } = this.props;

        const chestList = chests.map(chest => {
            const isAffordable = chest.price.amount <= Object.values(userCurrency)[chest.price.currency]
            return (
                <Chest
                    key={chest._id}
                    handleClick={buyChest.bind(this, userId, chest._id)}
                    userId={userId}
                    chest={chest}
                    isAffordable={isAffordable}
                />
            );
        })

        const goldPacks = currencyPacks.goldPacks.map((pack, i) => {
            const isAffordable = pack.price.amount <= Object.values(userCurrency)[pack.price.currency]
            return (
                <CurrencyPack
                    key={i}
                    handleClick={buyShopItem.bind(this, userId, pack.imageID)}
                    item={pack}
                    isAffordable={isAffordable}
                />
            );
        })

        const gemPacks = currencyPacks.gemPacks.map((pack, i) => {
            const isAffordable = false
            return (
                <CurrencyPack
                    key={i}
                    handleClick={buyChest}
                    userId={userId}
                    item={pack}
                    isAffordable={isAffordable}
                />
            );
        })

        return (
            <Wrapper>
                {(shopState === SHOP_STATE.BUSY && <Blackout><BlackoutText>Please wait...</BlackoutText></Blackout>)}
                <SubTitle>Chests</SubTitle>
                <Row>
                    {chestList}
                </Row>
                <SubTitle>Gold</SubTitle>
                <Row>
                    {goldPacks}
                </Row>
                <SubTitle>Gems</SubTitle>
                <Row>
                    {gemPacks}
                </Row>
            </Wrapper>
        )
    }
}

function mapStateToProps(state) {
    return {
        shopState: state.shop.shopState,
        chests: state.shop.chests,
        currencyPacks: state.shop.currencyPacks,
        userId: state.currentUser.user._id,
        userCurrency: state.currentUser.user.currency,
    };
}

export default connect(mapStateToProps, { buyChest, buyShopItem })(Shop);