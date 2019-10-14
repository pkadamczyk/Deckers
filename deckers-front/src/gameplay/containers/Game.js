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
import Board, { MAX_CARDS_ON_BOARD } from './Board';
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
        const { cardsOnHand, isMyTurn, gold } = this.props;

        const isDragging = currentlyDragged !== null;
        if (!isDragging) return this.setState({ currentTarget: null });
        if (id === null) return this.setState({ currentTarget: PLAYER_BOARD_ID });

        const card = cardsOnHand[currentlyDragged.index]

        // Make sure you can summon the card
        if (currentlyDragged.droppableId === PLAYER_HAND_ID) {
            if (!isMyTurn) return this.setState({ currentTarget: PLAYER_BOARD_ID }); // Check if its my turn

            const isAffordable = gold >= card.inGame.stats.cost;
            if (!isAffordable) return this.setState({ currentTarget: PLAYER_BOARD_ID }); // Check if i can afford dragged card
        }

        // Decide if target should be set, for attacking and spell targeting
        const isMinionTargeting = currentlyDragged.droppableId !== PLAYER_HAND_ID
        const isSpellTargeting = currentlyDragged.droppableId === PLAYER_HAND_ID && card.role === SPELL_ROLE

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
        const { cardsOnHand, gold, isMyTurn } = this.props;

        this.setState({ currentlyDragged: null })

        const card = source.droppableId === PLAYER_HAND_ID ? cardsOnHand[source.index] : null;
        const isSpellDropped = card !== null ? card.role === SPELL_ROLE : false;

        const isAffordable = card !== null ? gold >= card.inGame.stats.cost : false;
        const canBeSummoned = card !== null ? isMyTurn && isAffordable : false;

        if (!destination && currentTarget === PLAYER_HAND_ID) { }
        // Card cant be summoned, operation should be canceled
        else if ((!isAffordable || !canBeSummoned) && source.droppableId === PLAYER_HAND_ID) { }

        // Takes care of single target spells, hopefully
        else if (isSpellDropped && currentTarget !== PLAYER_HAND_ID) this.handleSummonCard(source, destination, currentTarget);

        // Attack enemy minion or hero
        else if (source.droppableId === PLAYER_BOARD_ID) {
            if (currentTarget.includes("enemy")) {
                this.props.dispatch(attack(source, currentTarget));
            }
        }

        // Cards reordered in hand
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
        const { cardsOnHand, cardsOnBoard, isMyTurn, gold } = this.props;
        const card = cardsOnHand[source.index];

        if (target === PLAYER_BOARD_ID) target = null;

        const isSpell = card.role === SPELL_ROLE
        const hasEffects = card.effects && card.effects.onSummon && card.effects.onSummon.length > 0
        if (hasEffects) {
            const spellTarget = card.effects.onSummon[0].target
            const isSingleTarget = Object.values(Effect.TARGET_LIST.SINGLE_TARGET).includes(spellTarget)

            const cardNeedsTarget = isSpell && isSingleTarget
            if (target === null && cardNeedsTarget) return
        }

        const isAffordable = gold >= card.inGame.stats.cost;
        if (!isAffordable || !isMyTurn) return

        // Determines if card has any onSummon effect that need special care
        // If not, simply summons the card
        if (!hasEffects) {
            this.props.dispatch(summonCard(
                source,
                destination || target,
                target
            ));
            return
        }

        // If card is a summoning spell, check if theres a place for that card
        const hasSummonEffect = card.effects.onSummon[0].effect === Effect.EFFECT_LIST.SUMMON
        if (hasSummonEffect && isSpell)
            if (cardsOnBoard.length >= MAX_CARDS_ON_BOARD) return

        this.props.dispatch(summonCard(
            source,
            destination || target,
            target
        ));
    }

    render() {
        const { currentTarget, currentlyDragged } = this.state;
        const { gameReady, enemyCardsOnBoard } = this.props;

        let isMinionDragged, isCardDragged;
        if (currentlyDragged) {
            isMinionDragged = currentlyDragged.droppableId === PLAYER_BOARD_ID;
            isCardDragged = currentlyDragged.droppableId === PLAYER_HAND_ID;
        }
        const currentlyDraggedCardId = isCardDragged ? currentlyDragged.index : null; // Used to determine and apply spell targeting css

        // Used to determine if enemy minions without taunt and hero can be targeted
        const hasEnemyTauntOnBoard = enemyCardsOnBoard.map(card => card.inGame.stats.hasTaunt).includes(true)
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
                        hasEnemyTauntOnBoard={hasEnemyTauntOnBoard}
                    />
                    <EnemyDeck />
                    <EndTurnButton />
                    <PlayerDeck />
                    <PlayerHero
                        handleCleanTarget={this.handleCleanTarget}
                        handleSetTarget={this.handleSetTarget}
                        currentlyDraggedCardId={currentlyDraggedCardId}
                        currentTarget={currentTarget}
                    />
                    <PlayerHand
                        currentTarget={currentTarget}
                        isMinionDragged={isMinionDragged}
                        handleCleanTarget={this.handleCleanTarget}
                        handleSetTarget={this.handleSetTarget}
                    />
                    <Board
                        currentlyDragged={currentlyDragged}
                        isMinionDragged={isMinionDragged}
                        currentTarget={currentTarget}
                        handleCleanTarget={this.handleCleanTarget}
                        handleSetTarget={this.handleSetTarget}
                        currentlyDraggedCardId={currentlyDraggedCardId}
                        hasEnemyTauntOnBoard={hasEnemyTauntOnBoard}
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
        isMyTurn: state.game.isMyTurn,
        gold: state.game.playerHeroGold,

        cardsOnBoard: state.game.cardsOnBoard, // To determne what card has been summoned
        cardsOnHand: state.game.cardsOnHand, // To determine if target should be set

        enemyCardsOnBoard: state.game.enemyCardsOnBoard, // To determine if minions without taunt can be targeted
    }
}

export default connect(mapStateToProps)(Game);
