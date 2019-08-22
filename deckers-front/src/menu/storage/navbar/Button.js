import React, { Component } from 'react';

import styled from "styled-components";
import buttonBackground from '../../../graphic/button_04.png';

const StyledButton = styled.button`
    background-image: url(${buttonBackground});
    background-size: cover;
    background-repeat: no-repeat;

    margin: auto 0 10% 0;
    border: none;
    border-radius: 10px;
    font-size: 1.2rem;
    height:3.6rem;

    color:white;
`

class Button extends Component {
    render() {
        const { text, handleOnClick } = this.props;
        return <StyledButton onClick={handleOnClick}>{text}</StyledButton>
    }
}

export default Button;