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
import { reorderCardsInHand, summonCard } from '../../store/actions/game'
import PlayerHero from '../components/PlayerHero';
import EnemyHero from '../components/EnemyHero';
import EnemyDeck from '../components/EnemyDeck';
import PlayerDeck from '../components/PlayerDeck';

const Wrapper = styled.div`
    top:100px;
    height: 325px;
    width: 60%;
    border: 1px solid red;
    margin:auto;
`;

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

class Game extends Component {
    constructor(props) {
        super(props);

        this.onDragEnd = this.onDragEnd.bind(this);
    }

    id2List = {
        droppable: 'cardsOnBoard',
        droppable2: 'cardsOnHand'
    };

    getList = id => this.props[this.id2List[id]];

    onDragEnd(result) {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

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
            debugger
        }
    }

    render() {
        const { cardsOnBoard, cardsOnHand } = this.props;
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <EnemyHero></EnemyHero>
                <EnemyDeck></EnemyDeck>
                <div className="gameObj">
                    <div className="EnemyHand">
                        <Link to="/matchmaking">
                            <button className="btn btn-danger">EXIT</button>
                        </Link>
                    </div>

                    {/* <PlayerInfoContainer/> */}

                    <Wrapper>
                        <EnemyBoard />
                        <PlayerBoard items={cardsOnBoard} />
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
        cardsOnHand: state.game.cardsOnHand
    }
}

export default connect(mapStateToProps)(Game); 