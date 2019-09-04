import React, { Component } from 'react';
import Portrait from "./Portrait"

import { connect } from "react-redux"
import styled from "styled-components"

export const PLAYER_PORTRAIT_ID = "player-portrait";

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
        const { health, gold, username } = this.props;
        return (
            <Div>
                <Portrait
                    health={health}
                    gold={gold}
                    username={username}
                />
            </Div>
        )
    }
}

function mapStateToProps(state) {
    return {
        health: state.game.playerHeroHealth,
        gold: state.game.playerHeroGold,
        username: state.game.gameInfo.player,
    }
}

export default connect(mapStateToProps)(PlayerHero);