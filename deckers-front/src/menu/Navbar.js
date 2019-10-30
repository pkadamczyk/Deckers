import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";

import styled from "styled-components"
import avatarImg from '../graphic/avatar_01.png'
import goldImg from '../graphic/icon_currency_gold.PNG'
import gemImg from '../graphic/icon_currency_gem.PNG'
import playButton from '../graphic/play_button.png'


const Wrapper = styled.nav`
    display: flex;
    flex-direction: row;

    width: 100%;
    height: 10%;

    text-align: center;
    background: #313747;

    text-shadow: 2px 1px #303433;
    color: #ede3de;
    transition: all 0.3s;

    -webkit-box-shadow: 0px 6px 6px 0px rgba(0,0,0,0.44);
    -moz-box-shadow: 0px 6px 6px 0px rgba(0,0,0,0.44);
    box-shadow: 0px 6px 6px 0px rgba(0,0,0,0.44);
`

const Avatar = styled.div`
    height: 50px;
    width: 50px;
    background-image: url(${avatarImg});
    background-size:contain;
    background-repeat: no-repeat;
`
const Username = styled.div`
    font-size: 1.5rem;
    margin: auto;
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
    border:none;
    font-size: 1.5rem;
    line-height: 2rem;
    color:white;

    background: inherit;
    height: 100%;
    padding: 0 15px;
    cursor: pointer;

    border-right: 1px solid #fff;

    :focus{
        outline:0;
    }
`

const PlayButton = styled.button`
    font-size: 1.5rem;
    color:white;

    position: relative;
    z-index: 2;

    width: 106px;
    height: 68px;
    border:none;
    cursor: pointer;

    border-radius: 10px;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url(${playButton});

    :focus{
        outline:0;
    }
`;

const ButtonGroup = styled.div`
    width:100%;
    display:flex;
    flex-direction: row;
    ${'' /* justify-content: flex-end; */}
`

const CurrencyPanel = styled.div`
    justify-content: space-evenly;
`

const Block = styled.div`
    display:flex;
    flex-direction: row;
    border-left: 1px solid #fff;

    padding: 6px 10px;
`

class Navbar extends Component {
    render() {
        const { user, tagList, logout } = this.props;

        const isAdmin = user.tag === tagList.admin
        return (
            <Wrapper>
                <ButtonGroup>

                    <Link to="/matchmaking">
                        <PlayButton>Play</PlayButton>
                    </Link>

                    <Link to="/profile">
                        <Button>Profile</Button>
                    </Link>

                    <Link to="/cards">
                        <Button>Cards</Button>
                    </Link>

                    <Link to="/shop">
                        <Button>Shop</Button>
                    </Link>

                    {isAdmin && <Link to="/admin">
                        <Button>Admin</Button>
                    </Link>}

                    <Button onClick={logout}>Logout</Button>
                </ButtonGroup>

                <Block>
                    <CurrencyPanel>
                        <GoldAmount > {user.currency.gold}</GoldAmount>
                        <GemAmount> {user.currency.gems}</GemAmount>
                    </CurrencyPanel>
                </Block>
                <Block>
                    <Avatar />
                    <Username>{user.username}</Username>
                </Block>
            </Wrapper>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.currentUser.user,
        tagList: state.config.tagList,
    };
}

export default connect(mapStateToProps, { logout })(Navbar);