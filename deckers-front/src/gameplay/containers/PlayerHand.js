import React, { Component } from 'react';

import styled from "styled-components";
import { Droppable, Draggable } from 'react-beautiful-dnd';

import Item from "./Item"

const DroppableDiv = styled.div`
    height: 145px;
    width: 650px;

    background: ${props => props.isDraggingOver ? 'lightblue' : 'lightgrey'};
    display: flex;
    padding: 8px;
    overflow: auto;

    position: absolute;
    bottom: 0;
    right: 0;
`;

class PlayerHand extends Component {
    render() {
        return (
            <Droppable droppableId="droppable2" direction="horizontal">
                {(provided, snapshot) => (
                    <DroppableDiv
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        isDraggingOver={snapshot.isDraggingOver}
                    >
                        {this.props.items.map((item, index) => (
                            <Item key={item.id} item={item} index={index} ></Item>
                        ))}
                        {provided.placeholder}
                    </DroppableDiv>
                )}
            </Droppable>
        )
    }
}

export default PlayerHand;