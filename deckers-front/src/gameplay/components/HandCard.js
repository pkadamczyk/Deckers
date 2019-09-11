import React, { Component } from 'react';
import styled from "styled-components"

import { Draggable } from 'react-beautiful-dnd';
import { CARD_WIDTH } from '../containers/Board';
import { PLAYER_HAND_ID } from '../containers/PlayerHand';
import { Effect } from '../../store/reducers/helpers/effects';

const StyledItem = styled.div` 
    margin: 0 8px 0 0;
    width: ${props => CARD_WIDTH + 'px'};
    height: 130px;
    transition: all cubic-bezier(0.2, 1, 0.1, 1) 0.8s;

    background: ${props => props.isDragging ? 'lightgreen' : 'grey'};

    border: ${props => !props.canBeSummoned ? 'none' : '2px solid rgba(165, 255, 48, 0.7)'};
    border-style: ${props => !props.canBeSummoned ? 'none' : 'solid solid none solid'};

    -webkit-box-shadow: ${props => !props.canBeSummoned ? "none" : "0px -1px 2px 3px rgba(165, 255, 48,0.7)"};
    -moz-box-shadow: ${props => !props.canBeSummoned ? "none" : "0px -1px 2px 3px rgba(165, 255, 48,0.7)"};
    box-shadow: ${props => !props.canBeSummoned ? "none" : "0px -1px 2px 3px rgba(165, 255, 48,0.7)"};
`;

function getStyle(style, snapshot, cardsOnBoardLength, currentTarget, card) {
    const isSingleTargetSpell = card.effects ? Object.values(Effect.TARGET_LIST.SINGLE_TARGET).includes(card.effects.onSummon[0].target) : false;
    const isGeneralTargetSpell = card.effects ? Object.values(Effect.TARGET_LIST.GENERAL).includes(card.effects.onSummon[0].target) : false;
    const shouldFadeOut = isSingleTargetSpell || isGeneralTargetSpell;

    // Handles card dragging and spell cards animations
    if (!snapshot.isDropAnimating) {
        if (shouldFadeOut && snapshot.isDragging) {
            // console.log(card.effects.onSummon[0].target)

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
    if (card.effects && shouldFadeOut && snapshot.isDragging)
        return { ...style, opacity: "0" }

    const { moveTo, curve, duration } = snapshot.dropAnimation;
    let translate;

    if (currentTarget === PLAYER_HAND_ID) translate = `translate(${moveTo.x}px, ${moveTo.y}px)`
    else translate = cardsOnBoardLength === 0 ? `translate(${moveTo.x}px, ${moveTo.y + (window.innerHeight / 2)}px)` : `translate(${moveTo.x - 50}px, ${moveTo.y}px)`;

    return {
        ...style,
        transform: `${translate}`,
        transition: `all ${curve} ${duration}s`,
    };
}
class Content extends Component {
    render() {
        const { provided, snapshot, item, cardsOnBoard, currentTarget, canBeSummoned } = this.props;
        return (
            <StyledItem
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                isDragging={snapshot.isDragging}
                canBeSummoned={canBeSummoned}
                style={getStyle(provided.draggableProps.style, snapshot, cardsOnBoard.length, currentTarget, item)}
            >
                <div>{item.name}</div>
                <div>Hp: {item.inGame.stats.health}</div>
                <div>Dmg: {item.inGame.stats.damage}</div>
                <div>Cost: {item.inGame.stats.cost}</div>
            </StyledItem>
        )

    }
}
class HandCard extends Component {
    constructor(props) {
        super(props);
        const uniqueId = '_' + Math.random().toString(36).substr(2, 9) + this.props.index;
        this.state = {
            uniqueId
        }
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
                    <Content
                        item={item}
                        provided={provided}
                        snapshot={snapshot}
                        canBeSummoned={canBeSummoned}
                        cardsOnBoard={cardsOnBoard}
                        currentTarget={currentTarget}
                    >
                    </Content>
                )}
            </Draggable>
        )
    }
}

export default HandCard;