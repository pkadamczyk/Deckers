import React, { Component } from 'react';
import { connect } from "react-redux"

import openSocket from 'socket.io-client';
import { endTurnEvent, playerDrawCardEvent, enemyDrawCardEvent } from '../../store/actions/socket';
export const SOCKET = openSocket('http://localhost:8080/game');

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
    }

    render() {
        return null;
    }
}

export default connect()(Socket); 