import React, { Component } from 'react';
import styled from "styled-components"

const StyledPortrait = styled.div`
    height: 100px;
    width:100px;

    position: absolute;
    bottom: ${props => props.player ? '5px' : 'none'};
    left: ${props => props.player ? '5px' : 'none'};

    background: white;
`;

class Portrait extends Component {
    render() {
        return (
            <StyledPortrait player={this.props.player} gameState={this.props.gameState} >
                {this.props.health}
                <div>Gold: {this.props.gold}</div>
            </StyledPortrait>
        )
    }
}

export default Portrait; 