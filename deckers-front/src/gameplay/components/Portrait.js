import React, { Component } from 'react';
import styled from "styled-components"

const StyledPortrait = styled.div`
    height: 100%;
    width:100%;

    background: white;
    z-index: -1;
`;

class Portrait extends Component {
    render() {
        const { isPlayer, gameState, health, gold } = this.props;
        return (
            <StyledPortrait isPlayer={isPlayer} gameState={gameState} >
                <div>Health: {health}</div>
                <div>Gold: {gold}</div>
            </StyledPortrait>
        )
    }
}

export default Portrait; 