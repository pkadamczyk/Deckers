import React, { Component } from 'react';
import { connect } from "react-redux"
import styled from "styled-components"

import { endTurn } from "../../store/actions/game"

const Button = styled.button`
    transition: 0.2s ease;
    height:50px;
    width:120px;

    position:absolute;
    z-index: 1;
    left:1%;
    top: 50%;

    background-color: ${props => props.isMyTurn ? "#749a02" : "#bbbbbb"};
    border-color: ${props => props.isMyTurn ? "#749a02" : "#bbbbbb"};

    border-radius: 6px;
    color: white;
    -webkit-box-shadow: ${props => props.isMyTurn ? "0px 0px 18px 0px rgba(145,189,9,1)" : "none"};
    -moz-box-shadow: ${props => props.isMyTurn ? "0px 0px 18px 0px rgba(145,189,9,1)" : "none"};
    box-shadow: ${props => props.isMyTurn ? "0px 0px 18px 0px rgba(145,189,9,1)" : "none"};

    :hover {
        background-color: ${props => props.isMyTurn ? "#85ab13" : "#bbbbbb"};
        border-color: ${props => props.isMyTurn ? "#85ab13" : "#bbbbbb"};
    };
    :focus { outline: none; }
`;

class EndTurnButton extends Component {
    render() {
        const { isMyTurn } = this.props;
        return (
            <Button
                onClick={() => this.props.dispatch(endTurn())}
                isMyTurn={isMyTurn}
            >
                End Turn
            </Button>
        )
    }
}

function mapStateToProps(state) {
    return {
        isMyTurn: state.game.isMyTurn
    }
}

export default connect(mapStateToProps)(EndTurnButton); 