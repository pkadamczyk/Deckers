import React, { Component } from 'react';
import Portrait from "./Portrait"

import { connect } from "react-redux"
import styled from "styled-components"

export const PLAYER_PORTRAIT_ID = "player-portrait";

const Div = styled.div`
    height: 100px;
    width: 100px;

    position: absolute;
    z-index:1;
    left: 5px;
    bottom: 5px;
`
class PlayerHero extends Component {
    render() {
        const { health, gold, username } = this.props;
        const cleanTarget = this.props.handleCleanTarget;
        const setTarget = this.props.handleSetTarget;

        return (
            <Div
                onMouseLeave={() => cleanTarget()}
                onMouseEnter={() => setTarget(PLAYER_PORTRAIT_ID)}
            >
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