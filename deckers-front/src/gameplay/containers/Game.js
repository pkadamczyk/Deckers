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
import { reorderCardsInHand } from '../../store/actions/game'

const Wrapper = styled.div`
    top:100px;
    height: 325px;
    width: 60%;
    border: 1px solid red;
    margin:auto;
`;

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    reorderCardsInHand(list, startIndex, endIndex)
};

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

        if (source.droppableId === destination.droppableId) {
            const items = this.props.dispatch(reorderCardsInHand(this.getList(source.droppableId),
                source.index,
                destination.index)

            );

            let state = { items };

            if (source.droppableId === 'droppable2') {
                state = { items2: items };
            }

            this.setState(state);
        } else {

            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            this.setState({
                items: result.droppable,
                items2: result.droppable2
            });
        }
    }

    render() {
        const { cardsOnBoard, cardsOnHand } = this.props;
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
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