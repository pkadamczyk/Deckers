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
import { Effect } from '../../store/reducers/helpers/effects';
export const ENEMY_HERO_ID = "enemy-portrait"

export const SPELL_ROLE = 8;

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
        }

        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragUpdate = this.onDragUpdate.bind(this);
        this.handleCleanTarget = this.handleCleanTarget.bind(this);
        this.handleSetTarget = this.handleSetTarget.bind(this);
    }

    handleCleanTarget() {
        this.handleSetTarget(PLAYER_BOARD_ID)
    }

    handleSetTarget(id) {
        let { currentlyDragged } = this.state;
        const { cardsOnHand } = this.props;

        const isDragging = currentlyDragged !== null;
        if (!isDragging) return this.setState({ currentTarget: null });
        if (id === null) return this.setState({ currentTarget: PLAYER_BOARD_ID });

        // Decide if target should be set, for attacking and spell targeting
        const isMinionTargeting = currentlyDragged.droppableId !== PLAYER_HAND_ID
        const isSpellTargeting = currentlyDragged.droppableId === PLAYER_HAND_ID && cardsOnHand[currentlyDragged.index].role === SPELL_ROLE

        const isTargeting = isMinionTargeting || isSpellTargeting

        const shouldSetTarget = isDragging && isTargeting;
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
        const { source, destination } = result;
        const { currentTarget } = this.state;

        this.setState({ currentlyDragged: null })

        const { cardsOnHand } = this.props;
        const card = source.droppableId === PLAYER_HAND_ID ? cardsOnHand[source.index] : null;
        const isSpellDropped = card !== null ? card.role === SPELL_ROLE : false;

        if (!destination && currentTarget === PLAYER_HAND_ID) { }
        // Takes care of single target spells, hopefully
        else if (isSpellDropped && currentTarget !== PLAYER_HAND_ID) this.handleSummonCard(source, destination, currentTarget);
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
        } else this.handleSummonCard(source, destination, currentTarget);

        this.props.dispatch(setGameState(GAME_STATE.IDLE))
        this.setState({ currentTarget: null })
    }

    handleSummonCard(source, destination, target = null) {
        const { cardsOnHand } = this.props;
        const card = cardsOnHand[source.index];

        if (target === PLAYER_BOARD_ID) target = null;

        let isSingleTarget = false
        if (card.effects) {
            const spellTarget = card.effects.onSummon.length > 0 ? card.effects.onSummon[0].target : null;
            isSingleTarget = Object.values(Effect.TARGET_LIST.SINGLE_TARGET).includes(spellTarget)
        }
        const cardNeedsTarget = card.role === SPELL_ROLE && isSingleTarget
        if (target === null && cardNeedsTarget) return

        this.props.dispatch(summonCard(
            source,
            destination || target,
            target
        ));
    }

    render() {
        const { currentTarget, currentlyDragged } = this.state;
        const { gameReady } = this.props;

        let isMinionDragged, isCardDragged;
        if (currentlyDragged) {
            isMinionDragged = currentlyDragged.droppableId === PLAYER_BOARD_ID;
            isCardDragged = currentlyDragged.droppableId === PLAYER_HAND_ID;
        }
        const currentlyDraggedCardId = isCardDragged ? currentlyDragged.index : null; // Used to determine and apply spell targeting css

        return (

            <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart} onDragUpdate={this.onDragUpdate}>
                <GameWrapper>
                    {!gameReady && <Starter />}
                    <EnemyHand />
                    <EnemyHero
                        isMinionDragged={isMinionDragged}
                        handleCleanTarget={this.handleCleanTarget}
                        handleSetTarget={this.handleSetTarget}
                        currentTarget={currentTarget}
                        currentlyDraggedCardId={currentlyDraggedCardId}
                    />
                    <EnemyDeck />
                    <EndTurnButton />
                    <PlayerDeck />
                    <PlayerHero
                        handleCleanTarget={this.handleCleanTarget}
                        handleSetTarget={this.handleSetTarget}
                        currentlyDraggedCardId={currentlyDraggedCardId}
                    />
                    <PlayerHand
                        currentTarget={currentTarget}
                        isMinionDragged={isMinionDragged}
                        handleCleanTarget={this.handleCleanTarget}
                        handleSetTarget={this.handleSetTarget}
                    />
                    <Board
                        isMinionDragged={isMinionDragged}
                        currentTarget={currentTarget}
                        handleCleanTarget={this.handleCleanTarget}
                        handleSetTarget={this.handleSetTarget}
                        currentlyDraggedCardId={currentlyDraggedCardId}
                    ></Board>


                </GameWrapper>
                <Socket />
            </DragDropContext>
        )
    }
}

function mapStateToProps(state) {
    return {
        gameReady: !!state.game.currentRound,

        cardsOnBoard: state.game.cardsOnBoard, // To determne what card has been summoned
        cardsOnHand: state.game.cardsOnHand // To determine if target should be set
    }
}

export default connect(mapStateToProps)(Game);
