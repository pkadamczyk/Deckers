import React from 'react';
import styled from "styled-components"

import { Draggable } from 'react-beautiful-dnd';

const StyledItem = styled.div` 
    userSelect: 'none';
    padding: 8 * 2;
    margin: 0 8px 0 0;
    width: 25%;

    background: ${props => props.isDragging ? 'lightgreen' : 'grey'};
`;

const Item = ({ item, index, isDragDisabled }) => (
    <Draggable draggableId={item.id} index={index} isDragDisabled={isDragDisabled}>
        {(provided, snapshot) => (
            <StyledItem
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                isDragging={snapshot.isDragging}
            >
                {item.content}
            </StyledItem>
        )}
    </Draggable>
)

export default Item;