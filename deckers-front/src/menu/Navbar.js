import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";

import styled from "styled-components"
import wrapperBackground from '../graphic/nav_background_03.png'
import playerInfoBackground from '../graphic/nav_background_02.png'
import avatarBackground from '../graphic/border_img_01.png'
import avatarImg from '../graphic/avatar_01.png'
import usernameBackground from '../graphic/title_01.png'
import goldImg from '../graphic/icon_currency_gold.PNG'
import gemImg from '../graphic/icon_currency_gem.PNG'
import buttonBackground from '../graphic/button_03.png'

const Wrapper = styled.nav`
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;

    text-align: center;
    background-image: url(${wrapperBackground});
    background-size: contain;
    background-repeat: repeat-y;

    text-shadow: 2px 1px #303433;
    color: #fff;
    transition: all 0.3s;
`

const PlayerInfo = styled.div`
  background-image: url(${playerInfoBackground});
  background-size: contain;
  background-repeat: no-repeat;
  text-shadow: 2px 1px #303433;
`

const AvatarHoleder = styled.div`
    background-image: url(${avatarBackground});
    background-size: contain;
    background-repeat: no-repeat;

    width:5rem;
    height: 7.6rem;
    margin: auto;
`

const Avatar = styled.div`
    height:80%;
    width:auto;
    position: relative;
    top:1.9rem;
    left:0.3rem;
    background-image: url(${avatarImg});
    background-size:contain;
    background-repeat: no-repeat;
`
const Username = styled.div`
    background-image: url(${usernameBackground});
    background-size: cover;
    background-repeat: no-repeat;

    font-size: 1.5rem;
    height: 3rem;
    padding-top:0px;
    margin-block-end: 0;
    margin: 0px;
`

const GoldAmount = styled.div`
    background-image: url(${goldImg});
    background-size: contain;
    background-repeat: no-repeat;

    padding-left: 1.8rem;
    margin-right: 1rem;
`
const GemAmount = styled.div`
    background-image: url(${gemImg});
    background-size: contain;
    background-repeat: no-repeat;

    padding-left: 2rem;
    margin-right: 1rem;
`

const Button = styled.button`
    background-image: url(${buttonBackground});
    background-size: cover;
    background-repeat: no-repeat;

    width: 70%;
    border:none;
    font-size: 1.5rem;
    border-radius: 10px;
    line-height: 2rem;
    color:white;

    margin: 10px 0;
    cursor: pointer;
`

const CurrencyPanel = styled.div`
    margin: 20px 0;

    display: flex;
    justify-content: space-evenly;
`

class Navbar extends Component {
    render() {
        const { user, logout, currency } = this.props;
        return (
            <Wrapper>
                <PlayerInfo>
                    <AvatarHoleder>
                        <Avatar />
                    </AvatarHoleder>

                    <Username>{user.username}</Username>
                    <CurrencyPanel>
                        <GoldAmount > {currency.gold}</GoldAmount>
                        <GemAmount> {currency.gems}</GemAmount>
                    </CurrencyPanel>

                    <Button onClick={logout}>Logout</Button>
                </PlayerInfo>

                <Link to="/profile">
                    <Button>Profile</Button>
                </Link>

                <Link to="/matchmaking">
                    <Button>Play</Button>
                </Link>

                <Link to="/cards">
                    <Button>Cards</Button>
                </Link>

                <Link to="/shop">
                    <Button>Shop</Button>
                </Link>
            </Wrapper>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.currentUser.user,
        currency: state.currentUser.user.currency
    };
}

export default connect(mapStateToProps, { logout })(Navbar);