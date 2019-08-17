import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chest from './ShopItem';
import { buyChest } from '../../store/actions/shop';

import styled from "styled-components"

const Row = styled.div`
    display: flex;
    height: 100%;
`

class Shop extends Component {
    render() {
        const { chests, userId, buyChest } = this.props;

        const chestList = chests.map(chest => (
            <Chest
                key={chest._id}
                handleClick={buyChest}
                userId={userId}
                chest={chest}
            />
        ));

        return (
            <Row>
                {chestList}
            </Row>

        )
    }
}

function mapStateToProps(state) {
    return {
        chests: state.shop,
        userId: state.currentUser.user._id
    };
}

export default connect(mapStateToProps, { buyChest })(Shop);