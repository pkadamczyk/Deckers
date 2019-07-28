import React, { Component } from 'react';
import Portrait from "./Portrait"

import { connect } from "react-redux"
import { Droppable } from 'react-beautiful-dnd';
import styled from "styled-components"
import { GAME_STATE } from '../../store/reducers/game';

export const ENEMY_PORTRAIT_ID = "enemy-portrait";

const Div = styled.div`
    height: 100px;
    width: 100px;

    position: absolute;
    z-index:1;
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
        const { health, gold, gameState, currentTarget, isMinionDragged, username } = this.props;
        const cleanTarget = this.props.handleCleanTarget;
        const setTarget = this.props.handleSetTarget;

        const isBeingTargeted = currentTarget === ENEMY_PORTRAIT_ID;
        const isDropDisabled = !isMinionDragged || isBeingTargeted;

        return (
            <Droppable
                droppableId={ENEMY_PORTRAIT_ID}
                direction="horizontal"
                isDropDisabled={isDropDisabled}
            >
                {(provided, snapshot) => (
                    <Div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        gameState={gameState}
                        onMouseLeave={() => cleanTarget()}
                        onMouseEnter={() => setTarget(ENEMY_PORTRAIT_ID)}
                    >
                        <Portrait
                            username={username}
                            health={health}
                            gold={gold}
                        />
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
        username: state.game.gameInfo.enemy,
    }
}

export default connect(mapStateToProps)(EnemyHero); 