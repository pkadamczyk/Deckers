import React, { Component } from 'react';

import { Droppable } from 'react-beautiful-dnd';
import styled from "styled-components"

import { connect } from "react-redux"
import { GAME_STATE } from '../../store/reducers/game';
import { CARD_WIDTH } from './Board';

const StyledItem = styled.div`
    width: ${props => CARD_WIDTH + 'px'};
    height: 130px;
    padding: 8px;

    background: tomato;
    margin: 0 8px 0 0;

    border: ${props => props.gameState === GAME_STATE.TARGETING ? '2px solid rgba(255, 0, 0, 0.7)' : 'none'};
    border-style: ${props => props.gameState === GAME_STATE.TARGETING ? 'solid solid none solid' : 'none'};

    -webkit-box-shadow: ${props => props.gameState === GAME_STATE.TARGETING ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)" : "none"};
    -moz-box-shadow: ${props => props.gameState === GAME_STATE.TARGETING ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)" : "none"};
    box-shadow: ${props => props.gameState === GAME_STATE.TARGETING ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)" : "none"};
`;

const DroppableDiv = styled.div`
    height: 50%;
    position: relative;

    width: 100vw;
    left: calc( -50vw + 50%);

    display: flex;
    align-items: flex-end;
    justify-content: center;
    margin: auto;
    padding: 8px;
`;
class EnemyBoard extends Component {
    constructor(props) {
        super(props);
        this.state = { flipped: null };
    }

    render() {
        const { currentTarget, isMinionDragged, gameState } = this.props;
        const cleanTarget = this.props.handleCleanTarget;
        const setTarget = this.props.handleSetTarget;
        let isBeingTargeted;
        let isDropDisabled;

        return (
            <DroppableDiv>
                {this.props.items.map((item, index) => {
                    let myId = `enemy-minion-${index}`

                    isBeingTargeted = currentTarget === myId
                    isDropDisabled = !isMinionDragged || isBeingTargeted

                    return (
                        <Droppable
                            droppableId={myId}
                            direction="horizontal"
                            key={index + 20}
                            isDropDisabled={isDropDisabled}
                        >
                            {(provided, snapshot) => (
                                <StyledItem ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    isDraggingOver={snapshot.isDraggingOver}
                                    gameState={gameState}
                                    onMouseLeave={() => cleanTarget()}
                                    onMouseEnter={() => setTarget(myId)}
                                >
                                    <div>{item.name}</div>
                                    <div>Hp: {item.stats[item.level].health}</div>
                                    <div>Dmg: {item.stats[item.level].damage}</div>
                                </StyledItem>
                            )
                            }
                        </Droppable>
                    )
                })}
            </DroppableDiv>
        )
    }
}

function mapStateToProps(state) {
    return {
        gameState: state.game.gameState
    }
}

export default connect(mapStateToProps)(EnemyBoard); 