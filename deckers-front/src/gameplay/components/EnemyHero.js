import React, { Component } from 'react';
import Portrait from "./Portrait"

import { connect } from "react-redux"
import { Droppable } from 'react-beautiful-dnd';
import styled from "styled-components"

const Div = styled.div``
class EnemyHero extends Component {
    render() {
        return (
            <Droppable droppableId="enemy-portrait" direction="horizontal">
                {(provided, snapshot) => (
                    <Div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        isDraggingOver={snapshot.isDraggingOver}
                    >
                        <Portrait
                            gameState={this.props.gameState}
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