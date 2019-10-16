import React, { Component } from 'react';
import styled from "styled-components"

import { Droppable } from 'react-beautiful-dnd';
import { GAME_STATE } from '../../store/reducers/game';
import { CARD_WIDTH } from '../containers/Board';
import { SPELL_ROLE } from '../containers/Game';
import { Effect } from '../../store/reducers/helpers/effects';
import { checkCondition } from '../../store/reducers/helpers/helpers/checkCondition';

const StyledItem = styled.div`
    width: ${props => props.isBeingTargeted ? (CARD_WIDTH + 10) + 'px' : CARD_WIDTH + 'px'};
    height: ${props => props.isBeingTargeted ? "140px" : "130px"};
    padding: 8px;

    transition: all 0.2s;

    background: tomato;
    margin: 0 8px 0 0;

    border: ${props => props.canBeTargeted ? '2px solid rgba(255, 0, 0, 0.7)'
        : props.canBeSpellTargeted ? '2px solid rgba(255, 153, 0, 0.7)' : 'none'};
    border-style: ${props => props.canBeTargeted || props.canBeSpellTargeted ? 'solid solid none solid' : 'none'};

    -webkit-box-shadow: ${props => props.canBeTargeted ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)"
        : props.canBeSpellTargeted ? "0px -1px 2px 3px rgba(255, 153, 0,0.7)" : "none"};
    -moz-box-shadow: ${props => props.canBeTargeted ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)"
        : props.canBeSpellTargeted ? "0px -1px 2px 3px rgba(255, 153, 0,0.7)" : "none"};
    box-shadow: ${props => props.canBeTargeted ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)"
        : props.canBeSpellTargeted ? "0px -1px 2px 3px rgba(255, 153, 0,0.7)" : "none"};
`

class EnemyMinion extends Component {
    render() {
        const { index, currentTarget, isMinionDragged, item, hasEnemyTauntOnBoard } = this.props;
        const cleanTarget = this.props.handleCleanTarget;
        const setTarget = this.props.handleSetTarget;
        const myId = `enemy-minion-${index}`;

        const isBeingTargeted = currentTarget === myId
        const isDropDisabled = !isMinionDragged || isBeingTargeted || hasEnemyTauntOnBoard

        const canBeSpellTargeted = this.canBeSpellTargeted()
        const couldBeTargeted = canBeSpellTargeted || isMinionDragged
        const canBeTargeted = couldBeTargeted && (!hasEnemyTauntOnBoard || item.inGame.stats.hasTaunt)
        const setTargetId = canBeTargeted ? myId : null

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
                        canBeTargeted={canBeTargeted}
                        canBeSpellTargeted={canBeSpellTargeted}
                        isBeingTargeted={isBeingTargeted}

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
        const { currentlyDraggedCardId, cardsOnHand, item } = this.props;
        if (currentlyDraggedCardId === null) return false;

        const currentlyDraggedCard = cardsOnHand[currentlyDraggedCardId]
        const isSpellDragged = currentlyDraggedCard.role === SPELL_ROLE

        if (!currentlyDraggedCard.effects || !currentlyDraggedCard.effects.onSummon.length > 0) return false;
        const spellTarget = currentlyDraggedCard.effects.onSummon[0].target;

        const canBeTargeted = [
            Effect.TARGET_LIST.SINGLE_TARGET.ALL,
            Effect.TARGET_LIST.SINGLE_TARGET.ENEMY,
            Effect.TARGET_LIST.SINGLE_TARGET.ENEMY_MINIONS,
            Effect.TARGET_LIST.SINGLE_TARGET.ALL_MINIONS,
        ].includes(spellTarget)

        // isConditionMeet needs to check if spell has any condition and if its meet
        let isConditionMeet = true;
        if (currentlyDraggedCard.effects.onSummon[0].effect === Effect.EFFECT_LIST.KILL_ON_CONDITION) {
            isConditionMeet = checkCondition(item, currentlyDraggedCard.effects.onSummon[0].value) // value of effect holds its condition
        }

        return canBeTargeted && isSpellDragged && isConditionMeet;
    }
}

export default EnemyMinion;