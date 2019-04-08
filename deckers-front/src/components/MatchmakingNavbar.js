import React, {Component} from 'react';
import { connect } from "react-redux";
import { findGame, leaveQue, acceptGame, disconnectFromGame, abandonGame, reconnectGame } from "../store/actions/matchMaking";

class MatchmakingNavbar extends Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }
    render(){
        return(
            <div className="mm-nav">
                <div className="btn-group">
                    <button className="btn btn-dark">Casual</button>
                    <button className="btn btn-light">Ranked</button>
                </div>
                <div className="mm_options">
                    {this.props.mm_state==="idle" && <button className="btn btn-success" onClick={this.props.findGame}>Find game</button>
                    }
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
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
      mm_state: state.matchMaking.mm_state
    };
  }

  
export default connect(mapStateToProps, { findGame, leaveQue, acceptGame, disconnectFromGame, abandonGame, reconnectGame })(MatchmakingNavbar);