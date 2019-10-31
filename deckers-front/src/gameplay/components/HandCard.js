import React, { Component } from 'react';

import { Draggable } from 'react-beautiful-dnd';
import Card from '../Card';
import styled from "styled-components"

import { PLAYER_HAND_ID } from '../containers/PlayerHand';
import { Effect } from '../../store/reducers/helpers/effects';
import { SPELL_ROLE } from '../containers/Game';
import { CARD_WIDTH } from '../containers/Board';

const CardWrap = styled.div`
    margin: 5px 5px 0 0;
    border: ${props => !props.canBeSummoned ? "2px solid transparent" : '2px solid rgba(165, 255, 48, 0.7)'};
    border-style: solid solid none solid;

    -webkit-box-shadow: ${props => !props.canBeSummoned ? "none" : "0px -1px 2px 3px rgba(165, 255, 48,0.7)"};
    -moz-box-shadow: ${props => !props.canBeSummoned ? "none" : "0px -1px 2px 3px rgba(165, 255, 48,0.7)"};
    box-shadow: ${props => !props.canBeSummoned ? "none" : "0px -1px 2px 3px rgba(165, 255, 48,0.7)"};

    height:${props => (CARD_WIDTH * 1.4) + "px"};
    max-height: 242px;
`

class HandCard extends Component {
    constructor(props) {
        super(props);
        const uniqueId = '_' + Math.random().toString(36).substr(2, 9) + this.props.index;
        this.state = { uniqueId }
    }

    render() {
        const { item, index, isMyTurn, cardsOnBoard, currentTarget, gold } = this.props;
        const { uniqueId } = this.state;

        const isAffordable = gold >= item.inGame.stats.cost;
        const canBeSummoned = isMyTurn && isAffordable;

        const isDragDisabled = !isMyTurn;

        return (
            <Draggable
                draggableId={uniqueId}
                index={index}
                isDragDisabled={isDragDisabled}
            >
                {(provided, snapshot) => (
                    <CardWrap
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        canBeSummoned={canBeSummoned}
                        style={getStyle(provided.draggableProps.style, snapshot, cardsOnBoard, currentTarget, item, canBeSummoned)}
                    >
                        <Card card={item} />
                    </CardWrap>
                )}
            </Draggable>
        )
    }
}

function getStyle(style, snapshot, cardsOnBoard, currentTarget, card, canBeSummoned) {
    const hasEffects = card.effects && card.effects.onSummon && card.effects.onSummon.length > 0
    const isSingleTargetSpell = hasEffects ? Object.values(Effect.TARGET_LIST.SINGLE_TARGET).includes(card.effects.onSummon[0].target) : false;

    const isSpell = card.role === SPELL_ROLE
    const shouldFadeOut = (isSingleTargetSpell || isSpell) && canBeSummoned;

    // Handles card dragging and spell cards animations
    if (!snapshot.isDropAnimating) {
        if (shouldFadeOut && snapshot.isDragging) {

            // Set cursor and reset it if not needed
            document.body.style.cursor = (currentTarget === PLAYER_HAND_ID) || !currentTarget ? "default" : "pointer";

            return {
                ...style,
                opacity: (currentTarget === PLAYER_HAND_ID) || !currentTarget ? "1" : "0",
            };
        }

        return style;
    }

    // Drop animation
    document.body.style.cursor = "default"; // Reset cursor
    if (hasEffects && shouldFadeOut && snapshot.isDragging)
        return { ...style, opacity: "0" }

    const { moveTo, curve, duration } = snapshot.dropAnimation;
    let translate;

    if (currentTarget === PLAYER_HAND_ID || !canBeSummoned) translate = `translate(${moveTo.x}px, ${moveTo.y}px)`
    else translate = cardsOnBoard.length === 0 ? `translate(${moveTo.x}px, ${moveTo.y + (window.innerHeight / 2)}px)` : `translate(${moveTo.x - 50}px, ${moveTo.y}px)`;

    return {
        ...style,
        transform: `${translate}`,
        transition: `all ${curve} ${duration}s`,
    };
}


export default HandCard;