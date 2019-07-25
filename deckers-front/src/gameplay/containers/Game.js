import React, { Component } from 'react';

import styled from "styled-components";
import { connect } from "react-redux";
import { DragDropContext } from 'react-beautiful-dnd';

import { reorderCardsInHand, summonCard, setGameState, attack } from '../../store/actions/game';
import { GAME_STATE } from '../../store/reducers/game';

import PlayerHero from '../components/PlayerHero';
import PlayerDeck from '../components/PlayerDeck';
import PlayerHand from "./PlayerHand";

import EnemyHero from '../components/EnemyHero';
import EnemyDeck from '../components/EnemyDeck';
import EnemyHand from '../components/EnemyHand';

import EndTurnButton from '../components/EndTurnButton';

import img from '../../graphic/background_02.PNG';
import Board from './Board';

import { PLAYER_BOARD_ID } from "./Board"
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
            isDestinationNull: false,
            currentTarget: null // ENEMY THAT PALYER IS CURRENTLY DRAGING OVER
        }

        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragUpdate = this.onDragUpdate.bind(this);
    }

    onDragStart(start) {
        // START_TARGETING
        if (start.source.droppableId === PLAYER_BOARD_ID) this.props.dispatch(setGameState(GAME_STATE.TARGETING));

        this.setState({ currentlyDragged: start.source.droppableId, isDestinationNull: false })
    }

    onDragUpdate = (update) => {
        let currentTarget;
        // After change need to be blocked somehow
        // Current target must be set to null if player change target or is draging over nothing
        if (!update.destination) this.setState({ isDestinationNull: true })
        else if (update.destination.droppableId !== this.state.currentTarget) {
            currentTarget = update.destination.droppableId
            this.setState({ isDestinationNull: false, currentTarget })
        }
        // console.log(currentTarget)
    };

    onDragEnd(result) {
        this.setState({ currentlyDragged: null, currentTarget: null })
        let { source, destination } = result;
        // dropped outside the list
        if (!destination) {
            this.setState({ isDestinationNull: true })
            return;
        }
        // END_TARGETING
        if (source.droppableId === PLAYER_BOARD_ID) {
            if (destination.droppableId === source.droppableId) return

            // this.props.dispatch(attack(source, destination));

            // this.props.dispatch(setGameState(GAME_STATE.IDLE))
            return
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
    }

    render() {
        const { cardsOnHand } = this.props;
        const { currentTarget } = this.state;

        const isMinionDragged = this.state.currentlyDragged === PLAYER_BOARD_ID;
        const isDestinationNull = this.state.isDestinationNull;

        return (
            <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart} onDragUpdate={this.onDragUpdate}>
                <GameWrapper>
                    <EnemyHand></EnemyHand>
                    <EnemyHero isMinionDragged={isMinionDragged}></EnemyHero>
                    <EnemyDeck></EnemyDeck>

                    <EndTurnButton></EndTurnButton>

                    <Board
                        isMinionDragged={isMinionDragged}
                        currentTarget={currentTarget}
                    ></Board>


                    <PlayerHand items={cardsOnHand} isDestinationNull={isDestinationNull}>
                    </PlayerHand>

                    <PlayerDeck></PlayerDeck>
                    <PlayerHero></PlayerHero>
                </GameWrapper>

            </DragDropContext>
        )
    }
}

function mapStateToProps(state) {
    return {
        cardsOnHand: state.game.cardsOnHand,
    }
}

export default connect(mapStateToProps)(Game);

// CAN BE USEFUL ONE DAY
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