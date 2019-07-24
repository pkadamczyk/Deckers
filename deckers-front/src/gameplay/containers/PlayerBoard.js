import React, { Component } from 'react';

import { Droppable } from 'react-beautiful-dnd';
import styled from "styled-components"

import Minion from '../components/Minion';

import { connect } from 'react-redux';
import { PLAYER_BOARD_ID, MAX_CARDS_ON_BOARD } from './Game';

export const CARD_WIDTH = 100

const DroppableDiv = styled.div`
    height: 100%;
    width: ${props => ((props.items.length + 1) * (CARD_WIDTH + 25)) + "px"};
    display: flex;
    justify-content: center;
    margin: auto;
    background: ${props => props.isDraggingOver ? 'lightblue' : 'lightgrey'};
    padding: 8px;
    margin-top: -19%;
`;

class PlayerBoard extends Component {
    render() {
        const isBoardFull = this.props.items.length >= MAX_CARDS_ON_BOARD;

        const isDropDisabled = (isBoardFull || this.props.isMinionDragged);

        return (
            <Droppable
                droppableId={PLAYER_BOARD_ID}
                direction="horizontal"
                isDropDisabled={isDropDisabled}
            >
                {(provided, snapshot) => {
                    return (
                        <DroppableDiv
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            isDraggingOver={snapshot.isDraggingOver}
                            items={this.props.items}
                        >
                            {this.props.items.map((item, index) => (
                                <Minion
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    isMyTurn={this.props.isMyTurn}
                                    cardsOnBoard={this.props.cardsOnBoard}
                                ></Minion>
                            ))}
                            {provided.placeholder}

                        </DroppableDiv>

                    )
                }}
            </Droppable>
        )
    }
}

function mapStateToProps(state) {
    return {
        isMyTurn: state.game.isMyTurn,
        cardsOnBoard: state.game.cardsOnBoard,
    }
}

export default connect(mapStateToProps)(PlayerBoard); 