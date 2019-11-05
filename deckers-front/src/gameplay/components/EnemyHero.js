import React, { Component } from 'react';
import Portrait from "./Portrait"

import { connect } from "react-redux"
import { Droppable } from 'react-beautiful-dnd';
import styled from "styled-components"
import { Effect } from '../../store/reducers/helpers/effects';
import { SPELL_ROLE } from '../containers/Game';

export const ENEMY_PORTRAIT_ID = "enemy-portrait";

const HitBox = styled.div`
    height: 200px;
    width: 200px;

    position: absolute;
    z-index:1;
    top: 5px;
    left: 660px;

    background-color: rgba(0,0,0,0);
`

const Div = styled.div`
    height: 120px;
    width: 120px;
    margin: auto;

    -webkit-box-shadow: ${props => !props.hasBorder ? "0px 0px 4px 7px rgba(0, 0, 0, 0.7)" : "0px 0px 4px 7px " + props.borderColor};
    -moz-box-shadow: ${props => !props.hasBorder ? "0px 0px 4px 7px rgba(0, 0, 0, 0.7)" : "0px 0px 4px 7px " + props.borderColor};
    box-shadow: ${props => !props.hasBorder ? "0px 0px 4px 7px rgba(0, 0, 0, 0.7)" : "0px 0px 4px 7px " + props.borderColor};

    transition: all 0.3s;
`
class EnemyHero extends Component {
    render() {
        const { health, gold, currentTarget, isMinionDragged, hasEnemyTauntOnBoard, avatarID } = this.props;
        const cleanTarget = this.props.handleCleanTarget;
        const setTarget = this.props.handleSetTarget;

        const isBeingTargeted = currentTarget === ENEMY_PORTRAIT_ID;
        const isDropDisabled = !isMinionDragged || isBeingTargeted || hasEnemyTauntOnBoard;

        const canBeSpellTargeted = this.canBeSpellTargeted()
        const couldBeTargeted = canBeSpellTargeted || isMinionDragged
        const canBeTargeted = couldBeTargeted && !hasEnemyTauntOnBoard
        const setTargetId = canBeTargeted ? ENEMY_PORTRAIT_ID : null

        // Avatar border styles
        const borderColor = canBeSpellTargeted ? `rgba(255, 153, 0, 0.7)` : isBeingTargeted ? `rgba(255, 0, 0, 0.7)` : "rgba(0, 0, 0, 0.7)";

        return (
            <HitBox
                onMouseLeave={() => cleanTarget()}
                onMouseEnter={() => setTarget(setTargetId)}
            >
                <Droppable
                    droppableId={ENEMY_PORTRAIT_ID}
                    direction="horizontal"
                    isDropDisabled={isDropDisabled}
                >
                    {(provided, snapshot) => (
                        <Div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            canBeTargeted={canBeTargeted}
                            borderColor={borderColor}
                            hasBorder={canBeTargeted}
                        >
                            <Portrait
                                health={health}
                                gold={gold}
                                avatarID={avatarID}
                            />
                        </Div>
                    )}
                </Droppable>
            </HitBox>
        )
    }

    canBeSpellTargeted() {
        const { currentlyDraggedCardId, cardsOnHand } = this.props;
        if (currentlyDraggedCardId === null) return false;

        const currentlyDraggedCard = cardsOnHand[currentlyDraggedCardId]
        const isSpellDragged = currentlyDraggedCard.role === SPELL_ROLE

        if (!currentlyDraggedCard.effects) return false;
        const spellTarget = currentlyDraggedCard.effects.onSummon.length > 0 ? currentlyDraggedCard.effects.onSummon[0].target : null;
        const canBeTargeted = [Effect.TARGET_LIST.SINGLE_TARGET.ALL, Effect.TARGET_LIST.SINGLE_TARGET.ENEMY].includes(spellTarget)

        return canBeTargeted && isSpellDragged;
    }
}

function mapStateToProps(state) {
    return {
        gameState: state.game.gameState,
        health: state.game.enemyHeroHealth,
        gold: state.game.enemyHeroGold,
        avatarID: state.game.gameInfo.enemy.avatarID,
        cardsOnHand: state.game.cardsOnHand,
    }
}

export default connect(mapStateToProps)(EnemyHero); 