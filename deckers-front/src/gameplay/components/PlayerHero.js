import React, { Component } from 'react';
import Portrait from "./Portrait"

import { connect } from "react-redux"
class PlayerHero extends Component {
    render() {
        return (

            <Portrait player health={this.props.health} gold={this.props.gold}>
            </Portrait>
        )
    }
}

function mapStateToProps(state) {

    return {
        gameState: state.game.gameState,
        health: state.game.playerHeroHealth,
        gold: state.game.playerHeroGold
    }
}

export default connect(mapStateToProps)(PlayerHero);