import React, { Component } from 'react';
import { connect } from "react-redux";
import openSocket from 'socket.io-client';
import { Link } from 'react-router-dom';
import {connectToGame} from '../store/actions/matchMaking';
const socket = openSocket('http://localhost:8080/matchmaking');



class MatchmakingNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        const usr_id = this.props;

        socket.on("game-ready", function (data) {
            // data.game_id
            console.log(data.game_id);
            connectToGame(data.game_id, this.props.usr_id, );
        
        })

        return (
            <div className="mm-nav">
                <div className="mm_options">
                    <button className="btn btn-success" onClick={() => {
                        socket.emit('join', { usr_id: usr_id, gameMode: 0 });
                        console.log("that happened");
                    }}>Find game</button>}
                    <Link to="/gameplay">
                        <button className="btn btn-danger">Test Gameplay</button>
                    </Link>
                    {/*                   
                    {this.props.mm_state==="idle" && <button className="btn btn-success" onClick={this.props.findGame}>Find game</button>}   
                     {this.props.mm_state==="lookingForGame" &&
                        (<div>
                            <button className="btn btn-success" onClick={this.props.acceptGame}>Accept game</button>
                            <button className="btn btn-danger" onClick={this.props.leaveQue}>Leave que</button>
                        </div>)
                    }
                    {this.props.mm_state==="playing" &&
                        (<div>
                            <button className="btn btn-danger" onClick={this.props.disconnectFromGame}>Disconnect</button>
                        </div>)
                    }
                    {this.props.mm_state==="disconnected" &&
                        (<div>
                            <button className="btn btn-success" onClick={this.props.reconnectGame}>Reconnect</button>
                            <button className="btn btn-danger" onClick={this.props.abandonGame}>Abandon</button>
                        </div>)
                    } */}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        mm_state: state.matchMaking.mm_state,
        usr_id: state.currentUser.user._id,
        deck_id: state.currentUser.user.decks[0]._id
    };
}


export default connect(mapStateToProps, { connectToGame })(MatchmakingNavbar);