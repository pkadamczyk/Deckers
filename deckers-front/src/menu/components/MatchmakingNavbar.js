import React, { Component } from 'react';
import { connect } from "react-redux";
import openSocket from 'socket.io-client';
import { Link, withRouter } from 'react-router-dom';
import { connectToGame } from '../../store/actions/matchmaking';
const socket = openSocket('http://localhost:8080/matchmaking');



class MatchmakingNavbar extends Component {
    constructor(props) {
        super(props)
        this.handleConnectToGame = this.handleConnectToGame.bind(this)
    }
    componentDidMount() {
        socket.on("game-ready", (data) => {
            console.log("Socket")
            this.handleConnectToGame(data)
        })
    }

    handleConnectToGame(data) {
        const { usr_id, deck_id, connectToGame, history } = this.props;
        connectToGame(data.game_id, usr_id, deck_id, history);
    }

    render() {
        const { usr_id, deck_id } = this.props;
        return (
            <div className="mm-nav">
                <div className="mm-options">
                    <button className="btn btn-success" onClick={() => {
                        socket.emit('join', { usr_id: usr_id, gameMode: 0, deck_id: deck_id });
                        console.log("LF game");
                    }}>Find game</button>}
                    <Link to="/gameplay">
                        <button className="btn btn-danger">TEST</button>
                    </Link>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        usr_id: state.currentUser.user._id,
        deck_id: state.matchmaking.deck
    };
}


export default withRouter(connect(mapStateToProps, { connectToGame })(MatchmakingNavbar))