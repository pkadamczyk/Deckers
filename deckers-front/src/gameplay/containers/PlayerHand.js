import React, { Component } from 'react';

import styled from "styled-components";
import { Droppable } from 'react-beautiful-dnd';
import { connect } from "react-redux"

import HandCard from "../components/HandCard"
import { CARD_WIDTH } from './Board';
export const PLAYER_HAND_ID = "player-hand"

const DroppableDiv = styled.div`
    width: ${props => CARD_WIDTH + ((props.cardsAmount * (CARD_WIDTH - 50)) + 20) + "px"};
    transition: all 0.5s;
    overflow: hidden;

    display: flex;
    align-items: flex-end;
    padding: 8px;
    padding-left: 80px;
    padding-top: 50px;

    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;
    margin-right: 20px;
`;

class PlayerHand extends Component {
    render() {
        const { isMinionDragged, isCardDragged, isMyTurn, gold, cardsOnBoard, cardsOnHand: cards, currentTarget, currentlyDragged } = this.props;
        const cleanTarget = this.props.handleCleanTarget;
        const setTarget = this.props.handleSetTarget;

        const isDropDisabled = isMinionDragged || isCardDragged;

        const handCards = cards.map((item, index) => (
            <HandCard
                key={item._id + index + cards.length}
                item={item}
                index={index}
                isMyTurn={isMyTurn}
                gold={gold}
                cardsOnBoard={cardsOnBoard}
                currentTarget={currentTarget}
                cardsAmount={cards.length}
                currentlyDragged={currentlyDragged}
            />
        ))

        return (
            <Droppable
                droppableId={PLAYER_HAND_ID}
                direction="horizontal"
                isDropDisabled={isDropDisabled}
            >
                {(provided, snapshot) => (
                    <DroppableDiv
                        cardsAmount={cards.length}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        isDraggingOver={snapshot.isDraggingOver}
                        onMouseLeave={() => cleanTarget()}
                        onMouseEnter={() => setTarget(PLAYER_HAND_ID)}
                    >
                        {handCards}
                        {/* {provided.placeholder} */}
                    </DroppableDiv>
                )
                }
            </Droppable>
        )
    }
}

function mapStateToProps(state) {
    return {
        isMyTurn: state.game.isMyTurn,
        cardsOnBoard: state.game.cardsOnBoard,
        cardsOnHand: state.game.cardsOnHand,
        gold: state.game.playerHeroGold,
    }
}

export default connect(mapStateToProps)(PlayerHand);