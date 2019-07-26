import React, { Component } from 'react';
import styled from "styled-components"

import { Draggable } from 'react-beautiful-dnd';
import { CARD_WIDTH } from '../containers/Board';
import { PLAYER_HAND_ID } from '../containers/PlayerHand';

const StyledItem = styled.div` 
    margin: 0 8px 0 0;
    width: ${props => CARD_WIDTH + 'px'};
    height: 130px;

    background: ${props => props.isDragging ? 'lightgreen' : 'grey'};

    border: ${props => props.isDragDisabled ? 'none' : '2px solid rgba(165, 255, 48, 0.7)'};
    border-style: ${props => props.isDragDisabled ? 'none' : 'solid solid none solid'};

    -webkit-box-shadow: ${props => props.isDragDisabled ? "none" : "0px -1px 2px 3px rgba(165, 255, 48,0.7)"};
    -moz-box-shadow: ${props => props.isDragDisabled ? "none" : "0px -1px 2px 3px rgba(165, 255, 48,0.7)"};
    box-shadow: ${props => props.isDragDisabled ? "none" : "0px -1px 2px 3px rgba(165, 255, 48,0.7)"};
`;

function getStyle(style, snapshot, cardsOnBoardLength, currentTarget) {
    if (!snapshot.isDropAnimating) return style;

    const { moveTo, curve, duration } = snapshot.dropAnimation;
    let translate;

    if (currentTarget == PLAYER_HAND_ID) translate = `translate(${moveTo.x}px, ${moveTo.y}px)`
    else translate = cardsOnBoardLength == 0 ? `translate(${moveTo.x}px, ${moveTo.y + 330}px)` : `translate(${moveTo.x - 50}px, ${moveTo.y}px)`;

    return {
        ...style,
        transform: `${translate}`,
        transition: `all ${curve} ${duration}s`,
    };
}

class Item extends Component {
    render() {
        const { item, index, isMyTurn, cardsOnBoard, currentTarget, gold } = this.props;

        const isAffordable = gold >= item.cost;
        const isDragDisabled = !isAffordable || !isMyTurn;

        return (
            <Draggable
                draggableId={item.id}
                index={index}
                isDragDisabled={isDragDisabled}
            >
                {(provided, snapshot) => (
                    <StyledItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                        isDragDisabled={isDragDisabled}
                        style={getStyle(provided.draggableProps.style, snapshot, cardsOnBoard.length, currentTarget)}
                    >
                        <span>Hp: {item.health}</span>
                        <span>Dmg: {item.damage}</span>
                        <span>Cost: {item.cost}</span>
                    </StyledItem>
                )}
            </Draggable>
        )
    }
}

export default Item;