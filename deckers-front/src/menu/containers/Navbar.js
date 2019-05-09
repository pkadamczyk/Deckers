import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {logout} from "../store/actions/auth";

class Navbar extends Component {
  render() {
    const { user, logout, currency } = this.props;
    return (
      <div className="wrapper">
        <nav id="sidebar">
          <div>
          <div>
            <img id="avatar" 
            src="https://i.pinimg.com/originals/ab/15/92/ab1592b6baabda0d6fcef84a9a734f77.jpg"
            alt="" />
            <h2>{user.username}</h2>
            {user.currency && (<p>Gold: {currency.gold} Gems: {currency.gems}</p>)}
            
            {!!Object.keys(user).length && (
              <button className="btn btn-danger" onClick={logout}>Logout</button>
            )}
            </div>
            {/* <div className="matchMaking">
              {this.props.mm_state==="lookingForGame"  && (
                <span><p>Looking for game...</p><button className="btn btn-xs btn-danger"
                onClick={this.props.leaveQue}>Leave que</button></span>)}
            </div> */}
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
    user: state.currentUser.user,
    currency: state.currentUser.user.currency
  };
}

export default connect(mapStateToProps, { logout})(Navbar);