import React, { Component } from 'react';

import { Droppable } from 'react-beautiful-dnd';
import styled from "styled-components"

import Minion from '../components/Minion';
import { connect } from 'react-redux';
import { PLAYER_BOARD_ID, MAX_CARDS_ON_BOARD } from './Game';

const DroppableDiv = styled.div`
    height: 50%;
    overflow: 'auto';

    background: ${props => props.isDraggingOver ? 'lightblue' : 'lightgrey'};
    display: flex;
    padding: 8px;
    overflow: auto;
`;


class PlayerBoard extends Component {
    render() {
        const isBoardFull = this.props.items.length > (MAX_CARDS_ON_BOARD - 1);
        const isMinionDragged = this.props.currentlyDragged === PLAYER_BOARD_ID;

        let isDropDisabled = (isBoardFull || isMinionDragged) ? true : false;

        return (
            <Droppable
                droppableId={PLAYER_BOARD_ID}
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