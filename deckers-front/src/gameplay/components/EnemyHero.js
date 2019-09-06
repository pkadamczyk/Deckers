import React, { Component } from 'react';
import Portrait from "./Portrait"

import { connect } from "react-redux"
import { Droppable } from 'react-beautiful-dnd';
import styled from "styled-components"
import { GAME_STATE } from '../../store/reducers/game';
import { Effect } from '../../store/reducers/helpers/effects';
import { SPELL_ROLE } from '../containers/Game';

export const ENEMY_PORTRAIT_ID = "enemy-portrait";

const Div = styled.div`
    height: 100px;
    width: 100px;

    position: absolute;
    z-index:1;
    top: 5px;
    right: 5px;

    border: ${props => props.gameState === GAME_STATE.TARGETING ? '2px solid rgba(255, 0, 0, 0.7)'
        : props.canBeSpellTargeted ? '2px solid rgba(255, 153, 0, 0.7)' : 'none'};
    border-style: ${props => props.gameState === GAME_STATE.TARGETING || props.canBeSpellTargeted ? 'solid solid none solid' : 'none'};

    -webkit-box-shadow: ${props => props.gameState === GAME_STATE.TARGETING ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)"
        : props.canBeSpellTargeted ? "0px -1px 2px 3px rgba(255, 153, 0,0.7)" : "none"};
    -moz-box-shadow: ${props => (props.gameState === GAME_STATE.TARGETING) ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)"
        : props.canBeSpellTargeted ? "0px -1px 2px 3px rgba(255, 153, 0,0.7)" : "none"};
    box-shadow: ${props => (props.gameState === GAME_STATE.TARGETING) ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)"
        : props.canBeSpellTargeted ? "0px -1px 2px 3px rgba(255, 153, 0,0.7)" : "none"};
`
class EnemyHero extends Component {
    render() {
        const { health, gold, gameState, currentTarget, isMinionDragged, username } = this.props;
        const cleanTarget = this.props.handleCleanTarget;
        const setTarget = this.props.handleSetTarget;

        const isBeingTargeted = currentTarget === ENEMY_PORTRAIT_ID;
        const isDropDisabled = !isMinionDragged || isBeingTargeted;

        const canBeSpellTargeted = this.canBeSpellTargeted()
        const setTargetId = canBeSpellTargeted || isMinionDragged ? ENEMY_PORTRAIT_ID : null
        return (
            <Droppable
                droppableId={ENEMY_PORTRAIT_ID}
                direction="horizontal"
                isDropDisabled={isDropDisabled}
            >
                {(provided, snapshot) => (
                    <Div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        gameState={gameState}
                        onMouseLeave={() => cleanTarget()}
                        onMouseEnter={() => setTarget(setTargetId)}
                        canBeSpellTargeted={canBeSpellTargeted}
                    >
                        <Portrait
                            username={username}
                            health={health}
                            gold={gold}
                        />
                    </Div>
                )}
            </Droppable>
        )
    }

    canBeSpellTargeted() {
        const { currentlyDraggedCardId, cardsOnHand } = this.props;
        if (currentlyDraggedCardId === null) return false;

        const currentlyDraggedCard = cardsOnHand[currentlyDraggedCardId]
        const isSpellDragged = currentlyDraggedCard.role === SPELL_ROLE

        if (!currentlyDraggedCard.effects) return false;
        const spellTarget = currentlyDraggedCard.effects.onSummon[0].target;
        const canBeTargeted = [Effect.TARGET_LIST.SINGLE_TARGET.ALL, Effect.TARGET_LIST.SINGLE_TARGET.ENEMY].includes(spellTarget)

        return canBeTargeted && isSpellDragged;
    }
}

function mapStateToProps(state) {
    return {
        gameState: state.game.gameState,
        health: state.game.enemyHeroHealth,
        gold: state.game.enemyHeroGold,
        username: state.game.gameInfo.enemy,
        cardsOnHand: state.game.cardsOnHand,
    }
}

export default connect(mapStateToProps)(EnemyHero); 