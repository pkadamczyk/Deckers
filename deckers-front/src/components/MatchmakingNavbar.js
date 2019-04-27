import React, { Component } from 'react';
import { connect } from "react-redux";
import { findGame, leaveQue, acceptGame, disconnectFromGame, abandonGame, reconnectGame } from "../store/actions/matchMaking";
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8080/matchmaking');
class MatchmakingNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        const usr_id = this.props;
        return (
            <div className="mm-nav">
                <div className="mm_options">
                    <button className="btn btn-success" onClick={() => {
                        socket.emit('join', { usr_id: usr_id, gameMode: 0 })
                    }}>Find game</button>}
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
        usr_id: state.currentUser.user._id
    };
}


export default connect(mapStateToProps, { findGame, leaveQue, acceptGame, disconnectFromGame, abandonGame, reconnectGame })(MatchmakingNavbar);