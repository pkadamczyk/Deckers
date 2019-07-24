import React, { Component } from 'react';
import styled from "styled-components"

import { Draggable } from 'react-beautiful-dnd';
import { CARD_WIDTH } from '../containers/PlayerBoard';

const StyledItem = styled.div` 
    userSelect: none;
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

function getStyle(style, snapshot, cardsOnBoardLength) {
    if (!snapshot.isDropAnimating) {
        return style;
    }

    const { moveTo, curve, duration } = snapshot.dropAnimation;
    // move to the right spot

    const translate = `translate(${moveTo.x}px, ${moveTo.y}px)`;
    // patching the existing style
    return {
        ...style,
        transform: `${translate}`,
        // slowing down the drop because we can
        transition: `all ${curve} ${duration}s`,
    };
}

// function getStyle(style, snapshot) {
//     if (!snapshot.isDropAnimating) {
//         return style;
//     }
//     return {
//         ...style,
//         // cannot be 0, but make it super tiny
//         transitionDuration: `0.001s`,
//     };
// }
class Minion extends Component {
    render() {
        const { item, index, isMyTurn, cardsOnBoard } = this.props;
        const isDragDisabled = !isMyTurn || !item.isReady;

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
                        style={getStyle(provided.draggableProps.style, snapshot, cardsOnBoard.length)}
                    >
                        <span>Hp: {item.health}</span>
                        <span>Dmg: {item.damage}</span>
                    </StyledItem>
                )}
            </Draggable>
        )

    }
}

export default Minion;