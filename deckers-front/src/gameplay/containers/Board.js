import React, { Component } from 'react';

import { Droppable } from 'react-beautiful-dnd';
import styled from "styled-components"
import { connect } from 'react-redux';

import EnemyBoard from './EnemyBoard';
import PlayerBoard from './PlayerBoard';

export const CARD_WIDTH = 100;
export const MAX_CARDS_ON_BOARD = 4;
export const PLAYER_BOARD_ID = "player-board";

const DroppableDiv = styled.div`
    height: 100%;
    width: ${props => ((props.items.length + 1) * (CARD_WIDTH + 25)) + "px"};
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: auto;
    
    padding: 8px;
`;

class Board extends Component {
    render() {
        const { isMinionDragged, currentTarget, handleCleanTarget, handleSetTarget, handleLockTarget, currentlyDraggedCardId } = this.props;
        const { enemyCardsOnBoard, cardsOnBoard, isMyTurn, cardsOnHand, playerGold } = this.props;

        let isAffordable = true;
        if (currentlyDraggedCardId !== null) {
            let currentlyDraggedCard;
            currentlyDraggedCard = cardsOnHand[currentlyDraggedCardId];

            console.log(currentlyDraggedCardId)
            console.log(currentlyDraggedCard)

            isAffordable = playerGold >= currentlyDraggedCard.inGame.stats.cost;
        }

        const isBoardFull = cardsOnBoard.length >= MAX_CARDS_ON_BOARD;
        const isDropDisabled = isBoardFull || isMinionDragged || !isAffordable;

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
                        items={cardsOnBoard}
                    >
                        <EnemyBoard
                            items={enemyCardsOnBoard}
                            isMinionDragged={isMinionDragged}
                            currentTarget={currentTarget}
                            handleCleanTarget={handleCleanTarget}
                            handleSetTarget={handleSetTarget}
                        />
                        <PlayerBoard
                            items={cardsOnBoard}
                            isMyTurn={isMyTurn}
                            placeholder={provided.placeholder}
                            handleLockTarget={handleLockTarget}
                        />
                    </DroppableDiv>
                )}
            </Droppable>
        )
    }
}

function mapStateToProps(state) {
    return {
        playerGold: state.game.playerHeroGold,
        cardsOnHand: state.game.cardsOnHand,
        isMyTurn: state.game.isMyTurn,
        cardsOnBoard: state.game.cardsOnBoard,
        enemyCardsOnBoard: state.game.enemyCardsOnBoard
    }
}

export default connect(mapStateToProps)(Board); 