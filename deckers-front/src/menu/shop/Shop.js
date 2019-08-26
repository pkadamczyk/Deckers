import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chest from './Chest';
import { buyChest } from '../../store/actions/shop';

import styled from "styled-components"
import { SHOP_STATE } from '../../store/reducers/shop';

const Row = styled.div`
    display: flex;
    height: 100%;
`

const Blackout = styled.div`
    height: 100%;
    width: 100%;

    position: absolute;
    left:0;
    top:0;
    
    display: flex;

    background: black;
    opacity: 0.65;
`

const Text = styled.div`
    color:white;
    font-size: 30px;
    margin:auto
`

class Shop extends Component {
    constructor(props) {
        super(props)

        this.handleChestBuy = this.handleChestBuy.bind(this);
    }

    handleChestBuy(userId, name) {
        this.props.dispatch(buyChest(userId, name))
    }

    render() {
        const { chests, userId, buyChest, shopState, userCurrency } = this.props;

        const chestList = chests.map(chest => {
            const isAffordable = chest.price.amount <= Object.values(userCurrency)[chest.price.currency]

            return (
                <Chest
                    key={chest._id}
                    handleClick={buyChest}
                    userId={userId}
                    chest={chest}
                    isAffordable={isAffordable}
                />
            );
        })

        return (
            <>
                {(shopState === SHOP_STATE.BUSY && <Blackout><Text>Please wait...</Text></Blackout>)}
                <Row>
                    {chestList}
                </Row>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        shopState: state.shop.shopState,
        chests: state.shop.chests,
        userId: state.currentUser.user._id,
        userCurrency: state.currentUser.user.currency,
    };
}

export default connect(mapStateToProps, { buyChest })(Shop);