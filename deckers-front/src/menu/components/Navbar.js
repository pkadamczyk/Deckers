import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {logout} from "../../store/actions/auth";

class Navbar extends Component {
  render() {
    const { user, logout, currency } = this.props;
    return (
      <div className="wrapper">
        <nav id="sidebar">
          <div id="player-info-nav">
          <div>
            <div id="avatar-holder">
              <div id="avatar-holder-bg">
                <div id="avatar"></div>
              </div>
            </div>
            <p id="usr_name">{user.username}</p>
            {user.currency && (<p className="currency-p">
              <span className="nav-currency-gold">{currency.gold}</span>   
              <span className="nav-currency-gem">{currency.gems}</span>
            </p>)}
            
           
            </div>

            {!!Object.keys(user).length && (
              <button className="btn btn-logout" onClick={logout}>Logout</button>
            )}
            {/* <div className="matchMaking">
              {this.props.mm_state==="lookingForGame"  && (
                <span><p>Looking for game...</p><button className="btn btn-xs btn-danger"
                onClick={this.props.leaveQue}>Leave que</button></span>)}
            </div> */}
          </div>
        
          <div className="nav-item">
          <Link to="/profile">
              <button className="btn mt-2">Profile</button>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/matchmaking">
            <button className="btn mt-2">Play</button>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/cards">
            <button className="btn mt-2">Cards</button>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/shop">
            <button className="btn mt-2">Shop</button>
            </Link>
          </div>
        </nav>
    </div>   

    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.currentUser.user,
    currency: state.currentUser.user.currency
  };
}

export default connect(mapStateToProps, { logout})(Navbar);