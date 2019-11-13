import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";

import styled from "styled-components"
import goldImg from '../graphic/icon_currency_gold.PNG'
import gemImg from '../graphic/icon_currency_gem.PNG'
import playButton from '../graphic/play_button.png'

import avatars from "../graphic/avatars"
import heroBackground from '../graphic/background_hero.png';
import { device } from "../mediaQueries";

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

    position: relative;
`

const Avatar = styled.div`
    height: 100%;
    width: 100%;
    background-image: url(${props => props.img});
    background-size: contain;
    background-repeat: no-repeat;
`

const AvatarBackground = styled.div`
    height: 54px;
    width: 54px;

    margin-right: 5px;

    background-image: url(${heroBackground});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    @media ${device.laptopL} {
        height: 65px;
        width: 65px;
    };
    @media ${device.desktopS} {
        height: 75px;
        width: 75px;
    }
`

const Username = styled.div`
    font-size: 1.5rem;
    margin: auto;

    @media ${device.laptopL} {
        font-size: 38px;
    };
    @media ${device.desktopS} {
        font-size: 42px;
    }
`

const GoldImg = styled.div`
    background-image: url(${goldImg});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

    height: 16px;
    width: 16px;
    margin-left: 4px;

    @media ${device.laptopL} {
        height: 25px;
        width: 25px;
    };
    @media ${device.desktopS} {
        height: 30px;
        width: 30px;
    }
`
const GemImg = styled.div`
    background-image: url(${gemImg});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

    height: 16px;
    width: 16px;
    margin-left: 4px;

    @media ${device.laptopL} {
        height: 25px;
        width: 25px;
    };
    @media ${device.desktopS} {
        height: 30px;
        width: 30px;
    }
`

const Currency = styled.div`
    font-size: 16px;
    display:flex;
    align-items:center;
    justify-content: center;

    @media ${device.laptopL} {
        font-size: 25px;
    };
    @media ${device.desktopS} {
        font-size: 30px;
    }
`

const Button = styled.button`
    border:none;
    font-size: 24px;
    color:white;
    transition: all 0.2s;

    background: #313747;
    height: 100%;
    padding: 10px 25px;
    cursor: pointer;

    border-right: 1px solid #fff;

    :focus{
        outline:0;
    };
    :hover{ background: #202636};

    @media ${device.laptopL} {
        font-size: 32px;
        padding: 0 30px;
    };
    @media ${device.desktopS} {
        font-size: 36px;
        padding: 0 35px;
    }
`
const PlayButton = styled.button`
    background: #8FC320;
    color: white;

    width: 100%;
    height: 100%;
    padding: 0 35px;
    margin: auto;

    position: relative;
    z-index: 2;

    border:none;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.4s;


    :focus {outline:0;};
    :hover{ background: #9FD430};
    :disabled {
        opacity: 0.65;
        cursor: inherit;
        background: ${props => props.danger ? "#c8423e" : "#8FC320"} ;
    };

    @media ${device.laptopL} {
        font-size: 36px;
        padding: 0 40px;
    };
    @media ${device.desktopS} {
        font-size: 40px;
        padding: 0 45px;
    }
`

const ButtonGroup = styled.div`
    width:100%;
    display:flex;
    flex-direction: row;
`

const CurrencyPanel = styled.div`
    display:flex;
    flex-direction: column;
    justify-content: space-evenly;
`

const Block = styled.div`
    display:flex;
    flex-direction: row;
    align-items: center;
    border-left: 1px solid #fff;

    padding: 6px 10px;
`

class Navbar extends Component {
    render() {
        const { user, tagList, logout } = this.props;

        const isAdmin = user.tag === tagList.admin;
        const userAvatar = avatars.get(user.avatarID)

        return (
            <Wrapper>
                <ButtonGroup>

                    <Link to="/matchmaking">
                        <PlayButton>Play</PlayButton>
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
                        <Currency>{user.currency.gold}<GoldImg /></Currency>
                        <Currency>{user.currency.gems}<GemImg /></Currency>
                    </CurrencyPanel>
                </Block>
                <Block>
                    <AvatarBackground>
                        <Avatar img={userAvatar} />
                    </AvatarBackground>

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