import React, { Component } from 'react';
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom';

import {
    endTurnEvent,
    playerDrawCardEvent,
    enemyDrawCardEvent,
    enemySummonedCardEvent,
    enemyCardAttackedEvent,
    combatResultsComparison,
    clearGameData,
    starterCardsPicked,
    serverReadyEvent,
    reconnectedToGameEvent
} from '../../store/actions/socket';
import { updateUserAfterGame, SOCKET } from '../../store/actions/game';
class Socket extends Component {
    componentDidMount() {
        SOCKET.on("turn-ended", () => {
            console.log("End turn")
            this.props.dispatch(endTurnEvent())
        })
        SOCKET.on("player-card-drew", ({ card }) => {
            console.log("Player card drew")
            this.props.dispatch(playerDrawCardEvent(card))
        })
        SOCKET.on("enemy-card-drew", () => {
            console.log("Enemy card drew")
            this.props.dispatch(enemyDrawCardEvent())
        })
        SOCKET.on("enemy-card-summoned", (data) => {
            console.log("Enemy card summoned")
            this.props.dispatch(enemySummonedCardEvent(data))
        })
        SOCKET.on("enemy-minion-attacked", (data) => {
            console.log("Enemy minion attacked")
            this.props.dispatch(enemyCardAttackedEvent(data))
        })
        SOCKET.on("combat-results-comparison", (data) => {
            this.props.dispatch(combatResultsComparison(data))
        })
        // SOCKET.on("game-over", ({ winner }) => {
        // })
        SOCKET.on('user-data-update', (data) => {
            this.props.dispatch(updateUserAfterGame(data));
            this.props.history.push("/matchmaking")
            this.props.dispatch(clearGameData({}));
        })
        SOCKET.on('starter-cards-picked', (data) => {
            this.props.dispatch(starterCardsPicked(data));
        })

        SOCKET.on('server-ready', (data) => {
            this.props.dispatch(serverReadyEvent(data));
        })

        SOCKET.on('player-reconnected', (data) => {
            this.props.dispatch(reconnectedToGameEvent(data));
        })
    }

    componentWillUnmount() {
        SOCKET.disconnect();
    }

    render() {
        return null;
    }
}

export default withRouter(connect()(Socket)); 