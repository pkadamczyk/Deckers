import React, { Component } from 'react';
import styled from "styled-components"

import { Droppable } from 'react-beautiful-dnd';
import { CARD_WIDTH } from '../containers/Board';
import { SPELL_ROLE } from '../containers/Game';
import { Effect } from '../../store/reducers/helpers/effects';
import { checkCondition } from '../../store/reducers/helpers/helpers/checkCondition';
import Card from '../Card';

const CardWrap = styled.div`
    margin: 0 8px 0 0;

    height:${props => (CARD_WIDTH * 1.4) + "px"};
    width: ${props => CARD_WIDTH + "px"};
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

        // Card border styles
        const alphaChannel = isBeingTargeted ? "0.7" : "0";
        const borderColor = canBeSpellTargeted ? `rgba(255, 153, 0, ${alphaChannel})` : canBeTargeted ? `rgba(255, 0, 0, ${alphaChannel})` : 'transparent';

        return (
            <Droppable
                droppableId={myId}
                direction="horizontal"
                key={index + 20}
                isDropDisabled={isDropDisabled}
            >
                {(provided, snapshot) => (
                    <CardWrap isMounted={item.inGame.stats.health >= 0} delayTime={500}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        canBeTargeted={canBeTargeted}
                        canBeSpellTargeted={canBeSpellTargeted}
                        isBeingTargeted={isBeingTargeted}

                        onMouseLeave={() => cleanTarget()}
                        onMouseEnter={() => setTarget(setTargetId)}
                    >
                        <Card card={item} hasBorder={canBeTargeted} borderColor={borderColor} />
                    </CardWrap>
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