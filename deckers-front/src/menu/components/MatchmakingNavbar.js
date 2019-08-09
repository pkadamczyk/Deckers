import React, { Component } from 'react';
import { connect } from "react-redux";
import openSocket from 'socket.io-client';
import { Link, withRouter } from 'react-router-dom';
import { connectToGame, abandonGame } from '../../store/actions/matchmaking';
let socket = openSocket('http://localhost:8080/matchmaking');

class MatchmakingNavbar extends Component {
    constructor(props) {
        super(props)
        this.state = { isBusy: false }

        this.handleConnectToGame = this.handleConnectToGame.bind(this)
        this.handleOnClick = this.handleOnClick.bind(this)
        this.handleAbandon = this.handleAbandon.bind(this)
    }

    componentDidMount() {
        socket = openSocket('http://localhost:8080/matchmaking');
        socket.on("game-ready", (data) => {
            this.handleConnectToGame(data)
        })
    }

    componentWillUnmount() {
        socket.disconnect()
    }

    handleConnectToGame(data) {
        const { usr_id, deck_id, connectToGame, history } = this.props;
        const { game_id } = data

        connectToGame(game_id, usr_id, deck_id, history);
    }

    handleOnClick() {
        const { usr_id, deck_id } = this.props;
        socket.emit('join', { usr_id, gameMode: 0, deck_id });
    }

    handleAbandon() {
        const { usr_id, abandonGame } = this.props;
        const { isBusy } = this.state;

        this.setState(state => ({ isBusy: !state.isBusy }))
        abandonGame(usr_id)
        setTimeout(() => this.setState(state => ({ isBusy: !state.isBusy })), 1000)
    }

    render() {
        const { deck_id, inGame } = this.props;
        const { isBusy } = this.state;

        const isDeckSelected = !!deck_id;

        return (
            <div className="mm-nav">
                <div className="mm-options">
                    {!inGame ?
                        <button className="btn btn-success" onClick={this.handleOnClick} disabled={!isDeckSelected}>
                            Find game
                        </button>
                        :
                        <div>
                            <button className="btn btn-danger" disabled={isBusy}>Reconnect</button>
                            <button className="btn btn-danger" onClick={this.handleAbandon} disabled={isBusy}>Abandon</button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        usr_id: state.currentUser.user._id,
        inGame: state.currentUser.user.inGame,
        deck_id: state.matchmaking.deck
    };
}


export default withRouter(connect(mapStateToProps, { connectToGame, abandonGame })(MatchmakingNavbar))