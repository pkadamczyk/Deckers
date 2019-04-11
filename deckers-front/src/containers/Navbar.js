import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { findGame, leaveQue, acceptGame, disconnectFromGame, 
  abandonGame, reconnectGame } from "../store/actions/matchMaking";
import currentUser from "../store/reducers/currentUser";

class Navbar extends Component {
    render() {
      const { user } = this.props;
      return (

        <div className="wrapper">
          <nav id="sidebar">

            <div>
              <img id="avatar" 
              src="https://i.pinimg.com/originals/ab/15/92/ab1592b6baabda0d6fcef84a9a734f77.jpg"
              alt="" />
              <h2>{this.props.user.username}</h2>
              <p>Gold: 30 Gems: 0</p>
              <div className="matchMaking">
                {this.props.mm_state==="lookingForGame"  && (
                  <span><p>Looking for game...</p><button className="btn btn-xs btn-danger"
                  onClick={this.props.leaveQue}>Leave que</button></span>)}
              </div>
            </div>
          
            <div className="nav-item">
            <Link to="/profile">
                <button className="btn btn-primary mt-2">Profile</button>
              </Link>
            </div>
            <div className="nav-item">
              <Link to="/matchmaking">
              <button className="btn btn-primary mt-2">Play</button>
              </Link>
            </div>
            <div className="nav-item">
              <Link to="/cards">
              <button className="btn btn-primary mt-2">Cards</button>
              </Link>
            </div>
            <div className="nav-item">
              <Link to="/shop">
              <button className="btn btn-primary mt-2">Shop</button>
              </Link>
            </div>
          </nav>
      </div>   

      );
    }
  }

  function mapStateToProps(state) {
    return {
      mm_state: state.matchMaking.mm_state,
      user: state.currentUser.user
    };
  }

export default connect(mapStateToProps, { findGame, leaveQue, acceptGame,
  disconnectFromGame, abandonGame, reconnectGame })(Navbar);