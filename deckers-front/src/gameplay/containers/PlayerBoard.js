import React, { Component } from 'react';

import styled from "styled-components"

import Minion from '../components/Minion';
import { connect } from "react-redux"

const Wrapper = styled.div`
    height: 50%;
    width: 100%;
    display: flex;
    justify-content: center;
    margin: auto;
    
    padding: 8px;
`;

class PlayerBoard extends Component {
    render() {
        const { isMyTurn, items, placeholder, gameState, cardsOnHand, currentTarget, currentlyDraggedCardId } = this.props
        const { handleCleanTarget, handleSetTarget } = this.props

        const minions = items.map((item, index) => (
            <Minion
                key={item._id + index}
                item={item}
                index={index}
                isMyTurn={isMyTurn}
                gameState={gameState}
                cardsOnHand={cardsOnHand}
                currentTarget={currentTarget}
                currentlyDraggedCardId={currentlyDraggedCardId}

                handleCleanTarget={handleCleanTarget}
                handleSetTarget={handleSetTarget}
            ></Minion>
        ))

        return (
            <Wrapper>
                {minions}
                {placeholder}
            </Wrapper>
        )
    }
}

function mapStateToProps(state) {
    return {
        cardsOnHand: state.game.cardsOnHand,
    }
}

export default connect(mapStateToProps)(PlayerBoard); 