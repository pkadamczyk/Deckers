import React, { Component } from 'react';
import Portrait from "./Portrait"

import { connect } from "react-redux"
import { Droppable } from 'react-beautiful-dnd';
import styled from "styled-components"
import { GAME_STATE } from '../../store/reducers/game';

const Div = styled.div`
    height: 100px;
    width: 100px;

    position: absolute;
    top: 5px;
    right: 5px;

    border: ${props => (props.gameState === GAME_STATE.TARGETING) ? '2px solid rgba(255, 0, 0, 0.7)' : 'none'};
    border-style: ${props => (props.gameState === GAME_STATE.TARGETING) ? 'solid solid none solid' : 'none'};

    -webkit-box-shadow: ${props => (props.gameState === GAME_STATE.TARGETING) ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)" : "none"};
    -moz-box-shadow: ${props => (props.gameState === GAME_STATE.TARGETING) ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)" : "none"};
    box-shadow: ${props => (props.gameState === GAME_STATE.TARGETING) ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)" : "none"};
`
class EnemyHero extends Component {
    render() {
        const isDropDisabled = !this.props.isMinionDragged;

        return (
            <Droppable
                droppableId="enemy-portrait"
                direction="horizontal"
                isDropDisabled={isDropDisabled}
            >
                {(provided, snapshot) => (
                    <Div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        isDraggingOver={snapshot.isDraggingOver}
                        gameState={this.props.gameState}
                    >
                        <Portrait
                            health={this.props.health}
                            gold={this.props.gold}
                        >
                        </Portrait>
                    </Div>
                )}
            </Droppable>
        )
    }
}

function mapStateToProps(state) {

    return {
        gameState: state.game.gameState,
        health: state.game.enemyHeroHealth,
        gold: state.game.enemyHeroGold,
    }
}

export default connect(mapStateToProps)(EnemyHero); 