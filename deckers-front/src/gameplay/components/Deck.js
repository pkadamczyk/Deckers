import React, { Component } from 'react';
import styled from "styled-components"

const Wrapper = styled.div`
    height: 100px;
    width: 100px;

    background: #313747;

    display: flex;
    flex-direction: column;

    -webkit-box-shadow: 0px 0px 4px 7px rgba(0, 0, 0, 0.7);
    -moz-box-shadow: 0px 0px 4px 7px rgba(0, 0, 0, 0.7);
    box-shadow: 0px 0px 4px 7px rgba(0, 0, 0, 0.7);
`;
class Deck extends Component {
    render() {

        return (
            <Wrapper>
                {this.props.children}
            </Wrapper>
        )
    }
}

export default Deck; 