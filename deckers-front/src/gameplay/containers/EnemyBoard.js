import React, { Component } from 'react';

import { Droppable } from 'react-beautiful-dnd';
import styled from "styled-components"

import { connect } from "react-redux"
import { GAME_STATE } from '../../store/reducers/game';

const StyledItem = styled.div`
    width: 100px;
    height: 130px;
    background: tomato;
    margin: 0 8px 0 0;
    margin-top: auto;

    border: ${props => props.gameState === GAME_STATE.TARGETING ? '2px solid rgba(255, 0, 0, 0.7)' : 'none'};
    border-style: ${props => props.gameState === GAME_STATE.TARGETING ? 'solid solid none solid' : 'none'};

    -webkit-box-shadow: ${props => props.gameState === GAME_STATE.TARGETING ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)" : "none"};
    -moz-box-shadow: ${props => props.gameState === GAME_STATE.TARGETING ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)" : "none"};
    box-shadow: ${props => props.gameState === GAME_STATE.TARGETING ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)" : "none"};
`;

const DroppableDiv = styled.div`
    height: 50%;

    background: lightblue;
    display: flex;
    justify-content: center;
    margin: auto;
    padding: 8px;
    overflow: auto;
`;

class EnemyBoard extends Component {
    render() {
        return (
            <DroppableDiv>
                {this.props.items.map((item, index) => (
                    <Droppable
                        droppableId={`eniemy-minion-${index}`}
                        direction="horizontal"
                        key={index + 20}
                        isDropDisabled={!this.props.isMinionDragged}
                    >
                        {(provided, snapshot) => (
                            <StyledItem ref={provided.innerRef}
                                {...provided.droppableProps}
                                isDraggingOver={snapshot.isDraggingOver}
                                gameState={this.props.gameState}
                            >
                                <span>Hp: {item.health}</span>
                                <span>Dmg: {item.damage}</span>
                            </StyledItem>
                        )}
                    </Droppable>
                ))}
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