import React, { Component } from 'react';
import Portrait from "./Portrait"

import { connect } from "react-redux"
import styled from "styled-components"

const Div = styled.div`
    height: 100px;
    width: 100px;

    z-index:1;
    position: absolute;
    left: 5px;
    bottom: 5px;
`
class PlayerHero extends Component {
    render() {
        const { health, gold } = this.props;
        return (
            <Div>
                <Portrait
                    health={health}
                    gold={gold}
                />
            </Div>

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