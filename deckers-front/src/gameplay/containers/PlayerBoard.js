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
        const { isMyTurn, items, placeholder, gameState, handleCleanTarget, handleSetTarget } = this.props

        const minions = items.map((item, index) => (
            <Minion
                key={item._id + index}
                item={item}
                index={index}
                isMyTurn={isMyTurn}
                gameState={gameState}

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

export default PlayerBoard; 