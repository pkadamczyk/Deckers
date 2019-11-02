import React, { Component } from 'react';

import { Droppable } from 'react-beautiful-dnd';
import styled from "styled-components"
import { connect } from 'react-redux';

import EnemyBoard from './EnemyBoard';
import PlayerBoard from './PlayerBoard';
import SpellFix from './SpellFix';

import { SPELL_ROLE } from './Game';
import { PLAYER_HAND_ID } from './PlayerHand';

export const CARD_WIDTH = 120;
export const MAX_CARDS_ON_BOARD = 4;
export const PLAYER_BOARD_ID = "player-board";

const DroppableDiv = styled.div`
    height: 100%;
    width: ${props => ((props.items.length + 1) * (CARD_WIDTH + 8)) + "px"};
    transition: all 0.4s;

    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: auto;
`;

class Board extends Component {
    render() {
        const { isMinionDragged, currentTarget, handleCleanTarget, handleSetTarget, currentlyDraggedCardId, hasEnemyTauntOnBoard } = this.props;
        const { enemyCardsOnBoard, cardsOnBoard, isMyTurn, gameState } = this.props;

        let isDropDisabled = this.shouldDropBeDisabled()

        // Should help with broken animations of aoe and general targeted spells
        const isSpellFixNeeded = this.checkIfSpellFixIsNeeded()

        return (
            <>
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
                            <SpellFix isNeeded={isSpellFixNeeded} />
                            <EnemyBoard
                                items={enemyCardsOnBoard}
                                isMinionDragged={isMinionDragged}
                                currentTarget={currentTarget}
                                currentlyDraggedCardId={currentlyDraggedCardId}
                                hasEnemyTauntOnBoard={hasEnemyTauntOnBoard}

                                handleCleanTarget={handleCleanTarget}
                                handleSetTarget={handleSetTarget}
                            />
                            <PlayerBoard
                                items={cardsOnBoard}
                                isMyTurn={isMyTurn}
                                placeholder={provided.placeholder}
                                gameState={gameState}
                                currentTarget={currentTarget}
                                currentlyDraggedCardId={currentlyDraggedCardId}

                                handleCleanTarget={handleCleanTarget}
                                handleSetTarget={handleSetTarget}
                            />
                        </DroppableDiv>
                    )}
                </Droppable>
            </>
        )
    }

    shouldDropBeDisabled() {
        const { isMinionDragged, currentlyDraggedCardId, currentTarget } = this.props;
        const { cardsOnBoard, cardsOnHand, playerGold } = this.props;

        const currentlyDraggedCard = currentlyDraggedCardId !== null ? cardsOnHand[currentlyDraggedCardId] : null;
        const isAffordable = currentlyDraggedCardId !== null ? playerGold >= currentlyDraggedCard.inGame.stats.cost : false

        const isBoardFull = cardsOnBoard.length >= MAX_CARDS_ON_BOARD;
        const isSpellDragged = currentlyDraggedCardId !== null ? currentlyDraggedCard.role === SPELL_ROLE : false

        return isBoardFull || (isMinionDragged || isSpellDragged) || !isAffordable || currentTarget === PLAYER_HAND_ID;
    }

    // Used to determine if non targeting spell is dragged, to help with animations
    checkIfSpellFixIsNeeded() {
        const { cardsOnHand, currentlyDragged, playerGold } = this.props
        if (!currentlyDragged) return false
        if (currentlyDragged.droppableId !== PLAYER_HAND_ID) return false

        const card = cardsOnHand[currentlyDragged.index]
        if (!card) return false

        const isSpell = card.role === SPELL_ROLE
        if (!isSpell) return false

        const isAffordable = playerGold >= card.inGame.stats.cost
        if (!isAffordable) return false;

        const hasEffects = card.effects && card.effects.onSummon && card.effects.onSummon.length > 0
        if (!hasEffects) return false

        return true
    }
}

function mapStateToProps(state) {
    return {
        gameState: state.game.gameState,
        playerGold: state.game.playerHeroGold,
        cardsOnHand: state.game.cardsOnHand,
        isMyTurn: state.game.isMyTurn,
        cardsOnBoard: state.game.cardsOnBoard,
        enemyCardsOnBoard: state.game.enemyCardsOnBoard
    }
}

export default connect(mapStateToProps)(Board); 