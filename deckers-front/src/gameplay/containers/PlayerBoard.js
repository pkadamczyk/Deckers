import React, { Component } from 'react';

import styled from "styled-components"

import Minion from '../components/Minion';

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
        const { isMyTurn, items, placeholder, handleLockTarget, gameState } = this.props

        const minions = items.map((item, index) => (
            <Minion
                key={item._id + index}
                item={item}
                index={index}
                isMyTurn={isMyTurn}
                handleLockTarget={handleLockTarget}
                gameState={gameState}
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

export default PlayerBoard; 