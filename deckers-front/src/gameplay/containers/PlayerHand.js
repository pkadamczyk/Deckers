import React, { Component } from 'react';

import styled from "styled-components";
import { Droppable } from 'react-beautiful-dnd';
import { connect } from "react-redux"

import HandCard from "../components/HandCard"
export const PLAYER_HAND_ID = "player-hand"

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
    z-index: 1;
`;

class PlayerHand extends Component {
    render() {
        const { isMinionDragged, isMyTurn, gold, cardsOnBoard, cardsOnHand: cards, currentTarget } = this.props;
        const cleanTarget = this.props.handleCleanTarget;
        const setTarget = this.props.handleSetTarget;

        const isDropDisabled = isMinionDragged;

        const handCards = cards.map((item, index) => (
            <HandCard
                key={item._id + index + cards.length}
                item={item}
                index={index}
                isMyTurn={isMyTurn}
                gold={gold}
                cardsOnBoard={cardsOnBoard}
                currentTarget={currentTarget}
            ></HandCard>
        ))

        return (
            <Droppable
                droppableId={PLAYER_HAND_ID}
                direction="horizontal"
                isDropDisabled={isDropDisabled}
            >
                {(provided, snapshot) => (
                    <DroppableDiv
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        isDraggingOver={snapshot.isDraggingOver}
                        onMouseLeave={() => cleanTarget()}
                        onMouseEnter={() => setTarget(PLAYER_HAND_ID)}
                    >
                        {handCards}
                        {provided.placeholder}
                    </DroppableDiv>
                )
                }
            </Droppable>
        )
    }
}

function mapStateToProps(state) {
    return {
        isMyTurn: state.game.isMyTurn,
        cardsOnBoard: state.game.cardsOnBoard,
        cardsOnHand: state.game.cardsOnHand,
        gold: state.game.playerHeroGold,
    }
}

export default connect(mapStateToProps)(PlayerHand);