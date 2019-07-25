import React, { Component } from 'react';

import styled from "styled-components"

import Minion from '../components/Minion';

export const CARD_WIDTH = 100

const Wrapper = styled.div`
    height: 50%;
    width: 100%;
    display: flex;
    justify-content: center;
    margin: auto;
    
    padding: 8px;
`;

// background: ${props => props.isDraggingOver ? 'lightblue' : 'tomato'};

class PlayerBoard extends Component {
    render() {
        const { isMyTurn, cardsOnBoard, items, placeholder } = this.props

        const minions = items.map((item, index) => (
            <Minion
                key={item.id}
                item={item}
                index={index}
                isMyTurn={isMyTurn}
                cardsOnBoard={cardsOnBoard}
            ></Minion>
        ))


        return (
            <Wrapper items={items}>
                {minions}
                {placeholder}
            </Wrapper>
        )
    }
}

export default PlayerBoard; 