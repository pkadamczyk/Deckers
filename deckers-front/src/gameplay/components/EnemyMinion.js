import React, { Component } from 'react';
import styled from "styled-components"

import { Droppable } from 'react-beautiful-dnd';
import { GAME_STATE } from '../../store/reducers/game';
import { CARD_WIDTH } from '../containers/Board';
import { SPELL_ROLE } from '../containers/Game';
import { Effect } from '../../store/reducers/helpers/effects';

const StyledItem = styled.div`
    width: ${props => CARD_WIDTH + 'px'};
    height: 130px;
    padding: 8px;

    background: tomato;
    margin: 0 8px 0 0;

    border: ${props => props.gameState === GAME_STATE.TARGETING ? '2px solid rgba(255, 0, 0, 0.7)'
        : props.canBeSpellTargeted ? '2px solid rgba(255, 153, 0, 0.7)' : 'none'};
    border-style: ${props => props.gameState === GAME_STATE.TARGETING || props.canBeSpellTargeted ? 'solid solid none solid' : 'none'};

    -webkit-box-shadow: ${props => props.gameState === GAME_STATE.TARGETING ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)"
        : props.canBeSpellTargeted ? "0px -1px 2px 3px rgba(255, 153, 0,0.7)" : "none"};
    -moz-box-shadow: ${props => props.gameState === GAME_STATE.TARGETING ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)"
        : props.canBeSpellTargeted ? "0px -1px 2px 3px rgba(255, 153, 0,0.7)" : "none"};
    box-shadow: ${props => props.gameState === GAME_STATE.TARGETING ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)"
        : props.canBeSpellTargeted ? "0px -1px 2px 3px rgba(255, 153, 0,0.7)" : "none"};
`

class EnemyMinion extends Component {
    render() {
        const { index, currentTarget, isMinionDragged, item, gameState } = this.props;
        const cleanTarget = this.props.handleCleanTarget;
        const setTarget = this.props.handleSetTarget;
        const myId = `enemy-minion-${index}`;

        const isBeingTargeted = currentTarget === myId
        const isDropDisabled = !isMinionDragged || isBeingTargeted

        const canBeSpellTargeted = this.canBeSpellTargeted()
        const setTargetId = canBeSpellTargeted || isMinionDragged ? myId : null
        return (
            <Droppable
                droppableId={myId}
                direction="horizontal"
                key={index + 20}
                isDropDisabled={isDropDisabled}
            >
                {(provided, snapshot) => (
                    <StyledItem ref={provided.innerRef}
                        {...provided.droppableProps}
                        isDraggingOver={snapshot.isDraggingOver}
                        gameState={gameState}
                        canBeSpellTargeted={canBeSpellTargeted}

                        onMouseLeave={() => cleanTarget()}
                        onMouseEnter={() => setTarget(setTargetId)}
                    >
                        <div>{item.name}</div>
                        <div>Hp: {item.inGame.stats.health}</div>
                        <div>Dmg: {item.inGame.stats.damage}</div>
                    </StyledItem>
                )
                }
            </Droppable>
        )

    }

    canBeSpellTargeted() {
        const { currentlyDraggedCardId, cardsOnHand } = this.props;
        if (currentlyDraggedCardId === null) return false;

        const currentlyDraggedCard = cardsOnHand[currentlyDraggedCardId]
        const isSpellDragged = currentlyDraggedCard.role === SPELL_ROLE

        if (!currentlyDraggedCard.effects) return false;
        const spellTarget = currentlyDraggedCard.effects.onSummon.length > 0 ? currentlyDraggedCard.effects.onSummon[0].target : null;
        const canBeTargeted = [
            Effect.TARGET_LIST.SINGLE_TARGET.ALL,
            Effect.TARGET_LIST.SINGLE_TARGET.ENEMY,
            Effect.TARGET_LIST.SINGLE_TARGET.ENEMY_MINIONS].includes(spellTarget)

        return canBeTargeted && isSpellDragged;
    }
}

export default EnemyMinion;