import React from 'react';
import styled from "styled-components"

import { Draggable } from 'react-beautiful-dnd';

const StyledItem = styled.div` 
    userSelect: 'none';
    padding: 8 * 2;
    margin: 0 8px 0 0;
    width: 25%;

    background: ${props => props.isDragging ? 'lightgreen' : 'grey'};

    border: ${props => props.isDragDisabled ? 'none' : '2px solid rgba(165, 255, 48, 0.7)'};
    border-style: ${props => props.isDragDisabled ? 'none' : 'solid solid none solid'};

    -webkit-box-shadow: ${props => props.isDragDisabled ? "none" : "0px -1px 2px 3px rgba(165, 255, 48,0.7)"};
    -moz-box-shadow: ${props => props.isDragDisabled ? "none" : "0px -1px 2px 3px rgba(165, 255, 48,0.7)"};
    box-shadow: ${props => props.isDragDisabled ? "none" : "0px -1px 2px 3px rgba(165, 255, 48,0.7)"};
`;

const Item = ({ item, index, isDragDisabled, isMyTurn }) => (
    <Draggable
        draggableId={item.id}
        index={index}
        isDragDisabled={isDragDisabled || !isMyTurn}
    >
        {(provided, snapshot) => (
            <StyledItem
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                isDragging={snapshot.isDragging}
                isDragDisabled={isDragDisabled || !isMyTurn}
            >
                <span>Hp: {item.health}</span>
                <span>Dmg: {item.damage}</span>
            </StyledItem>
        )}
    </Draggable>
)

export default Item;