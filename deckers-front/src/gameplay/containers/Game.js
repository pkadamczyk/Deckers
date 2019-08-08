import React, { Component } from 'react';

import { connect } from "react-redux"
import styled from "styled-components";
import { DragDropContext } from 'react-beautiful-dnd';

import { reorderCardsInHand, summonCard, setGameState, attack } from '../../store/actions/game';
import { GAME_STATE } from '../../store/reducers/game';

import PlayerHero from '../components/PlayerHero';
import PlayerDeck from '../components/PlayerDeck';
import PlayerHand, { PLAYER_HAND_ID } from "./PlayerHand";

import EnemyHero from '../components/EnemyHero';
import EnemyDeck from '../components/EnemyDeck';
import EnemyHand from '../components/EnemyHand';

import EndTurnButton from '../components/EndTurnButton';

import img from '../../graphic/background_02.PNG';
import Board from './Board';
import Socket from './Socket';

import { PLAYER_BOARD_ID } from "./Board"
import Starter from './Starter';
export const ENEMY_HERO_ID = "enemy-portrait"

const GameWrapper = styled.div`
    width: 100%;
    height: 100%;
    background-image: url(${img});
    background-size: cover;
    background-repeat: no-repeat;
`;
class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentlyDragged: null,
            currentTarget: null, // OBJECT THAT PLAYER IS CURRENTLY DRAGING OVER
            isTargetLocked: false,
        }

        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragUpdate = this.onDragUpdate.bind(this);
        this.handleCleanTarget = this.handleCleanTarget.bind(this);
        this.handleSetTarget = this.handleSetTarget.bind(this);
        this.handleLockTarget = this.handleLockTarget.bind(this);
    }

    handleLockTarget() {
        this.setState({ isTargetLocked: true })
    }

    handleCleanTarget() {
        let { currentlyDragged, isTargetLocked } = this.state;
        let shouldCleanTarget = currentlyDragged !== null && currentlyDragged.droppableId !== PLAYER_HAND_ID && !isTargetLocked;

        if (shouldCleanTarget) this.setState({ currentTarget: PLAYER_BOARD_ID });
    }

    handleSetTarget(id) {
        let { currentlyDragged, isTargetLocked } = this.state;
        let shouldSetTarget = currentlyDragged !== null && currentlyDragged.droppableId !== PLAYER_HAND_ID && !isTargetLocked;
        if (shouldSetTarget) this.setState({ currentTarget: id });
    }

    onDragStart(start) {
        // START_TARGETING
        if (start.source.droppableId === PLAYER_BOARD_ID) this.props.dispatch(setGameState(GAME_STATE.TARGETING));
        else this.props.dispatch(setGameState(GAME_STATE.BUSY))

        this.setState({ currentlyDragged: start.source, currentTarget: start.source.droppableId })
    }

    onDragUpdate = (update) => {
        if (!update.destination) return
        if (this.state.currentTarget === PLAYER_HAND_ID || update.destination.droppableId === PLAYER_HAND_ID) {
            this.setState({ currentTarget: update.destination.droppableId });
        }
    };

    onDragEnd(result) {
        let { source, destination } = result;
        let { currentTarget } = this.state;

        this.setState({ currentlyDragged: null, isTargetLocked: false })

        if (!destination && currentTarget === PLAYER_HAND_ID) { }
        // END_TARGETING
        else if (source.droppableId === PLAYER_BOARD_ID) {
            if (currentTarget.includes("enemy")) {
                this.props.dispatch(attack(source, currentTarget));

                this.props.dispatch(setGameState(GAME_STATE.IDLE))
            }
        }
        // cards reordered in hand
        else if (source.droppableId === destination.droppableId) {
            this.props.dispatch(reorderCardsInHand(
                source.index,
                destination.index)
            );
        } else {
            this.props.dispatch(summonCard(
                source,
                destination
            ));
        }
        this.props.dispatch(setGameState(GAME_STATE.IDLE))
        this.setState({ currentTarget: null })
    }

    render() {
        const { currentTarget, currentlyDragged } = this.state;

        let isMinionDragged, isCardDragged;
        if (currentlyDragged) {
            isMinionDragged = currentlyDragged.droppableId === PLAYER_BOARD_ID;
            isCardDragged = currentlyDragged.droppableId === PLAYER_HAND_ID;
        }
        const currentlyDraggedCardId = isCardDragged ? currentlyDragged.index : null;

        return (

            <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart} onDragUpdate={this.onDragUpdate}>
                <GameWrapper>
                    <Starter />
                    <EnemyHand />
                    <EnemyHero
                        isMinionDragged={isMinionDragged}
                        handleCleanTarget={this.handleCleanTarget}
                        handleSetTarget={this.handleSetTarget}
                        currentTarget={currentTarget}
                    />
                    <EnemyDeck />
                    <EndTurnButton />

                    <PlayerHand
                        currentTarget={currentTarget}
                        isMinionDragged={isMinionDragged}
                    />

                    <Board
                        isMinionDragged={isMinionDragged}
                        currentTarget={currentTarget}
                        handleCleanTarget={this.handleCleanTarget}
                        handleSetTarget={this.handleSetTarget}
                        handleLockTarget={this.handleLockTarget}
                        currentlyDraggedCardId={currentlyDraggedCardId}
                    ></Board>

                    <PlayerDeck />
                    <PlayerHero />
                </GameWrapper>
                <Socket />
            </DragDropContext>
        )
    }
}

export default connect()(Game);
