import React, { Component } from 'react';
import styled from "styled-components"

import { Draggable } from 'react-beautiful-dnd';
import { CARD_WIDTH } from '../containers/Board';
import { GAME_STATE } from '../../store/reducers/game';
import { Effect } from '../../store/reducers/helpers/effects';
import { SPELL_ROLE } from '../containers/Game';
import { checkCondition } from '../../store/reducers/helpers/helpers/checkCondition';
import Card from '../Card';

function getStyle(style, snapshot) {
    if (!snapshot.isDropAnimating) return style;
    const { moveTo, curve, duration } = snapshot.dropAnimation;

    const translate = `translate(${moveTo.x}px, ${moveTo.y}px)`;
    return {
        ...style,
        transform: `${translate}`,
        transition: `all ${curve} ${duration}s`,
    };
}

const CardWrap = styled.div`
    position: relative;
    z-index: 0;

    transition: width 0.2s;
    transition: height 0.2s;
    transition: border 0.2s;

    margin: 0 8px 0 0;

    height:${props => (CARD_WIDTH * 1.4) + "px"};
    width: ${props => CARD_WIDTH + "px"};
`

class Content extends Component {
    componentDidUpdate(prevProps) {
        const { snapshot, setIsDragging } = this.props;
        if (prevProps.snapshot.isDragging !== snapshot.isDragging) setIsDragging(snapshot.isDragging)
    }

    render() {
        const { provided, snapshot, isDragDisabled, item, index, currentTarget, canBeSpellTargeted } = this.props;
        const cleanTarget = this.props.handleCleanTarget;
        const setTarget = this.props.handleSetTarget;

        const myId = `player-minion-${index}`
        const setTargetId = canBeSpellTargeted ? myId : null

        const isBeingTargeted = currentTarget === myId

        const hasBorder = !isDragDisabled || canBeSpellTargeted
        const borderColor = !isDragDisabled ? 'rgba(165, 255, 48, 0.7)'
            : canBeSpellTargeted ? 'rgba(255, 153, 0, 0.7)' : 'transparent';

        return (
            <CardWrap
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                isDragDisabled={isDragDisabled}
                isBeingTargeted={isBeingTargeted}
                canBeSpellTargeted={canBeSpellTargeted}
                style={getStyle(provided.draggableProps.style, snapshot)}

                onMouseLeave={() => cleanTarget()}
                onMouseEnter={() => setTarget(setTargetId)}
            >
                <Card card={item} hasBorder={hasBorder} borderColor={borderColor} />
            </CardWrap>
        )
    }
}

class Minion extends Component {
    constructor(props) {
        super(props);
        const uniqueId = '_' + Math.random().toString(36).substr(2, 9);
        this.state = {
            isDragging: false,
            uniqueId
        }
        this.setIsDragging = this.setIsDragging.bind(this);
    }

    setIsDragging(isDragging) {
        this.setState({ isDragging })
    }

    render() {
        const { item, index, handleCleanTarget, handleSetTarget, currentTarget } = this.props;
        const { uniqueId } = this.state;

        const isDragDisabled = this.shouldDropBeDisabled()
        const canBeSpellTargeted = this.canBeSpellTargeted()

        return (
            <Draggable
                draggableId={uniqueId}
                index={index}
                isDragDisabled={isDragDisabled}
            >
                {(provided, snapshot) => (
                    <Content
                        provided={provided}
                        snapshot={snapshot}
                        isDragDisabled={isDragDisabled}
                        item={item}
                        setIsDragging={this.setIsDragging}
                        index={index}
                        canBeSpellTargeted={canBeSpellTargeted}
                        currentTarget={currentTarget}

                        handleCleanTarget={handleCleanTarget}
                        handleSetTarget={handleSetTarget}
                    />
                )}
            </Draggable>
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
            Effect.TARGET_LIST.SINGLE_TARGET.ALLY,
            Effect.TARGET_LIST.SINGLE_TARGET.ALLY_MINIONS,
            Effect.TARGET_LIST.SINGLE_TARGET.ALL_MINIONS,
        ].includes(spellTarget)

        // isConditionMeet needs to check if spell has any condition and if its meet
        let isConditionMeet = true;
        if (currentlyDraggedCard.effects.onSummon[0].effect === Effect.EFFECT_LIST.KILL_ON_CONDITION) {
            isConditionMeet = checkCondition(item, currentlyDraggedCard.effects.onSummon[0].value) // value of effect hold condition
        }

        return canBeTargeted && isSpellDragged && isConditionMeet;
    }

    shouldDropBeDisabled() {
        const { item, isMyTurn, gameState, } = this.props;
        const { isDragging } = this.state;

        const hasDamage = item.inGame.stats.damage > 0;

        return !isMyTurn || !item.inGame.isReady || !hasDamage || (gameState !== GAME_STATE.IDLE && !isDragging);;
    }
}

export default Minion;