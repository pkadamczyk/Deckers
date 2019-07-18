import React, { Component } from 'react';
import Board from './Board';
import Hand from './Hand';
import { Link } from 'react-router-dom';
import PlayerInfoContainer from './PlayerInfoContainer';
import DeckContainer from './DeckContainer';

import PlayerBoard from './PlayerBoard';
import EnemyBoard from './EnemyBoard';

import PlayerHand from "./PlayerHand"

import styled from "styled-components"
import { connect } from "react-redux"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { reorderCardsInHand, summonCard, setGameState, attack } from '../../store/actions/game'
import PlayerHero from '../components/PlayerHero';
import EnemyHero from '../components/EnemyHero';
import EnemyDeck from '../components/EnemyDeck';
import PlayerDeck from '../components/PlayerDeck';
import EndTurnButton from '../components/EndTurnButton';
import { GAME_STATE } from '../../store/reducers/game';

const Wrapper = styled.div`
    top:100px;
    height: 325px;
    width: 60%;
    border: 1px solid red;
    margin:auto;
`;

// const move = (source, destination, droppableSource, droppableDestination) => {
//     const sourceClone = Array.from(source);
//     const destClone = Array.from(destination);
//     const [removed] = sourceClone.splice(droppableSource.index, 1);

//     destClone.splice(droppableDestination.index, 0, removed);

//     const result = {};
//     result[droppableSource.droppableId] = sourceClone;
//     result[droppableDestination.droppableId] = destClone;

//     return result;
// };

export const PLAYER_BOARD_ID = "player-board"
export const MAX_CARDS_ON_BOARD = 4

class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentlyDragged: null,
        }

        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
    }

    onDragStart(start) {
        // START_TARGETING
        if (start.source.droppableId === PLAYER_BOARD_ID) this.props.dispatch(setGameState(GAME_STATE.TARGETING))
        this.setState({ currentlyDragged: start.source.droppableId })
    }

    onDragEnd(result) {
        this.setState({ currentlyDragged: null })
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        // END_TARGETING
        if (source.droppableId === PLAYER_BOARD_ID) {
            if (destination.droppableId === source.droppableId) return
            this.props.dispatch(attack(source, destination));

            this.props.dispatch(setGameState(GAME_STATE.IDLE))
            return
        }
        this.props.dispatch(setGameState(GAME_STATE.IDLE))

        // cards reordered in hand
        if (source.droppableId === destination.droppableId) {
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
    }

    render() {
        const { cardsOnBoard, cardsOnHand, enemyCardsOnBoard } = this.props;

        return (
            <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
                <EnemyHero></EnemyHero>
                <EnemyDeck></EnemyDeck>

                <EndTurnButton></EndTurnButton>
                <div className="gameObj">
                    <div className="EnemyHand">
                        <Link to="/matchmaking">
                            <button className="btn btn-danger">EXIT</button>
                        </Link>
                    </div>

                    {/* <PlayerInfoContainer/> */}

                    <Wrapper>
                        <EnemyBoard items={enemyCardsOnBoard} />
                        <PlayerBoard items={cardsOnBoard} currentlyDragged={this.state.currentlyDragged} />
                    </Wrapper>

                    {/* <Hand /> */}

                    <PlayerHand items={cardsOnHand}>
                    </PlayerHand>

                </div>
                <PlayerDeck></PlayerDeck>
                <PlayerHero></PlayerHero>
            </DragDropContext>


        )
    }
}

function mapStateToProps(state) {
    return {
        cardsOnBoard: state.game.cardsOnBoard,
        cardsOnHand: state.game.cardsOnHand,
        enemyCardsOnBoard: state.game.enemyCardsOnBoard
    }
}

export default connect(mapStateToProps)(Game); 