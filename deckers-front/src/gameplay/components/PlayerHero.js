import React, { Component } from 'react';
import Portrait from "./Portrait"

import { connect } from "react-redux"
class PlayerHero extends Component {
    render() {
        return (
            <Portrait player health={this.props.health}>
            </Portrait>
        )
    }
}

function mapStateToProps(state) {
    return {
        gameState: state.game.gameState,
        health: state.game.enemyHeroHealth,
    }
}

export default connect(mapStateToProps)(PlayerHero);