import React, { Component } from 'react';

import styled from "styled-components";
import { Droppable } from 'react-beautiful-dnd';
import { connect } from "react-redux"

import Item from "../components/Item"

const DroppableDiv = styled.div`
    height: 23%;
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
            <Droppable droppableId="player-hand" direction="horizontal">
                {(provided, snapshot) => (
                    <DroppableDiv
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        isDraggingOver={snapshot.isDraggingOver}
                    >
                        {this.props.items.map((item, index) => (
                            <Item
                                key={item.id}
                                item={item}
                                index={index}
                                isMyTurn={this.props.isMyTurn}
                                gold={this.props.gold}
                                cardsOnBoard={this.props.cardsOnBoard}
                                isDestinationNull={this.props.isDestinationNull}
                            ></Item>
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
        cardsOnBoard: state.game.cardsOnBoard,
        gold: state.game.playerHeroGold,
    }
}

export default connect(mapStateToProps)(PlayerHand);