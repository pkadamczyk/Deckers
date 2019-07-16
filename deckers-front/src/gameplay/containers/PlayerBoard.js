import React, { Component } from 'react';

import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';
import styled from "styled-components"

import Item from "./Item"

const DroppableDiv = styled.div`
    height: 50%;
    overflow: 'auto';

    background: ${props => props.isDraggingOver ? 'lightblue' : 'lightgrey'};
    display: flex;
    padding: 8px;
    overflow: auto;
`;

const MAX_CARDS_ON_BOARD = 3

class PlayerBoard extends Component {
    render() {
        let isDropDisabled = this.props.items.length > MAX_CARDS_ON_BOARD ? true : false;

        return (
            <Droppable
                droppableId="droppable"
                direction="horizontal"
                isDropDisabled={isDropDisabled}
            >
                {(provided, snapshot) => (
                    <DroppableDiv
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        isDraggingOver={snapshot.isDraggingOver}
                    >
                        {this.props.items.map((item, index) => (
                            <Item key={item.id} item={item} index={index} isDragDisabled={true}></Item>
                        ))}
                        {provided.placeholder}
                    </DroppableDiv>
                )}
            </Droppable>
        )
    }
}

export default PlayerBoard; 