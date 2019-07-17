import React, { Component } from 'react';

import { Droppable } from 'react-beautiful-dnd';
import styled from "styled-components"

import Minion from '../components/Minion';
import { connect } from 'react-redux';

const DroppableDiv = styled.div`
    height: 50%;
    overflow: 'auto';

    background: ${props => props.isDraggingOver ? 'lightblue' : 'lightgrey'};
    display: flex;
    padding: 8px;
    overflow: auto;
`;

const MAX_CARDS_ON_BOARD = 4

class PlayerBoard extends Component {
    render() {
        let isDropDisabled = this.props.items.length > (MAX_CARDS_ON_BOARD - 1) ? true : false;

        return (
            <Droppable
                droppableId="player-board"
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
                            <Minion key={item.id} item={item} index={index} isMyTurn={this.props.isMyTurn}></Minion>
                        ))}
                        {provided.placeholder}
                    </DroppableDiv>
                )}
            </Droppable>
        )
    }
}

function mapStateToProps(state) {
    return {
        isMyTurn: state.game.isMyTurn,
    }
}

export default connect(mapStateToProps)(PlayerBoard); 