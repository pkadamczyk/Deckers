import React, { Component } from 'react';
import styled from "styled-components"

const StyledDiv = styled.div`
    height: 150px;
    width: 80px;

    background: black;
`;
class Deck extends Component {
    render() {

        return (
            <StyledDiv>
                {this.props.children}
            </StyledDiv>
        )
    }
}

export default Deck; 