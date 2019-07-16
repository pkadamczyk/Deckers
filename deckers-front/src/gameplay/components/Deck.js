import React, { Component } from 'react';
import styled from "styled-components"

const StyledDiv = styled.div`
    height: 150px;
    width: 80px;

    position: absolute;
    right: 0;

    background: black;
`;

class Deck extends Component {
    render() {
        let style;
        if (this.props.player) {
            style = {
                bottom: '35%',
            }
        }
        else {
            style = {
                top: '18%',
            }
        }
        return (
            <StyledDiv style={style}>

            </StyledDiv>
        )
    }
}

export default Deck; 