import React, { Component } from 'react';
import styled from "styled-components"

const StyledPortrait = styled.div`
    height: 100px;
    width:100px;

    position: absolute;

    background: white;
`;

class Portrait extends Component {
    render() {
        let style;
        if (this.props.player) {
            style = {
                bottom: '0',
                left: '0'
            }
        }
        else {
            style = {
                top: '0',
                right: '0'
            }
        }


        return (
            <StyledPortrait player={this.props.player} style={style}>

            </StyledPortrait>
        )
    }
}

export default Portrait; 