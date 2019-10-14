import React, { Component } from 'react';
import styled from "styled-components"

import { Draggable } from 'react-beautiful-dnd';
import { CARD_WIDTH } from '../containers/Board';
import { GAME_STATE } from '../../store/reducers/game';
import { Effect } from '../../store/reducers/helpers/effects';
import { SPELL_ROLE } from '../containers/Game';
import { checkCondition } from '../../store/reducers/helpers/helpers/checkCondition';

const StyledItem = styled.div` 
    position: relative;
    z-index: 1;

    margin: 0 8px 0 0;
    width: ${props => props.isBeingTargeted ? (CARD_WIDTH + 10) + 'px' : CARD_WIDTH + 'px'};
    height: ${props => props.isBeingTargeted ? "140px" : "130px"};

    background: grey;

    border: ${props => !props.isDragDisabled ? '2px solid rgba(165, 255, 48, 0.7)'
        : props.canBeSpellTargeted ? '2px solid rgba(255, 153, 0, 0.7)' : 'none'};
    border-style: ${props => !props.isDragDisabled || props.canBeSpellTargeted ? 'solid solid none solid' : 'none'};

    -webkit-box-shadow: ${props => !props.isDragDisabled ? "0px -1px 2px 3px rgba(165, 255, 48,0.7)"
        : props.canBeSpellTargeted ? "0px -1px 2px 3px rgba(255, 153, 0,0.7)" : "none"};
    -moz-box-shadow: ${props => !props.isDragDisabled ? "0px -1px 2px 3px rgba(165, 255, 48,0.7)"
        : props.canBeSpellTargeted ? "0px -1px 2px 3px rgba(255, 153, 0,0.7)" : "none"};
    box-shadow: ${props => !props.isDragDisabled ? "0px -1px 2px 3px rgba(165, 255, 48,0.7)"
        : props.canBeSpellTargeted ? "0px -1px 2px 3px rgba(255, 153, 0,0.7)" : "none"};
`;

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

        return (
            <StyledItem
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
                <div>{item.name}</div>
                <div>Hp: {item.inGame.stats.health}</div>
                <div>Dmg: {item.inGame.stats.damage}</div>
            </StyledItem>
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
        // const isIdle = gameState === GAME_STATE.IDLE && !isDragging
        // (gameState !== GAME_STATE.IDLE && !isDragging)

        return !isMyTurn || !item.inGame.isReady || !hasDamage || (gameState !== GAME_STATE.IDLE && !isDragging);;
    }


}

export default Minion;