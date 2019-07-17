import React, { Component } from 'react';
import styled from "styled-components"
import { GAME_STATE } from '../../store/reducers/game';

const StyledPortrait = styled.div`
    height: 100px;
    width:100px;

    position: absolute;
    bottom: ${props => props.player ? '5px' : 'none'};
    left: ${props => props.player ? '5px' : 'none'};

    top: ${props => !props.player ? '5px' : 'none'};
    right: ${props => !props.player ? '5px' : 'none'};
    background: white;

    border: ${props => (props.gameState === GAME_STATE.TARGETING) && !props.player ? '2px solid rgba(255, 0, 0, 0.7)' : 'none'};
    border-style: ${props => (props.gameState === GAME_STATE.TARGETING) && !props.player ? 'solid solid none solid' : 'none'};

    -webkit-box-shadow: ${props => (props.gameState === GAME_STATE.TARGETING) && !props.player ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)" : "none"};
    -moz-box-shadow: ${props => (props.gameState === GAME_STATE.TARGETING) && !props.player ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)" : "none"};
    box-shadow: ${props => (props.gameState === GAME_STATE.TARGETING) && !props.player ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)" : "none"};
`;

class Portrait extends Component {
    render() {
        return (
            <StyledPortrait player={this.props.player} gameState={this.props.gameState} >
                {this.props.health}
            </StyledPortrait>
        )
    }
}

export default Portrait; 