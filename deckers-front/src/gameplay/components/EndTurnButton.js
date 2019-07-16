import React, { Component } from 'react';

import styled from "styled-components"

const Button = styled.button`
    height:50px;
    width:120px;

    position:absolute;
    left:1%;
    top: 50%;

    background-color: #749a02;
    border-color: #749a02;

    border-radius: 6px;
    color: white;
  
    -webkit-box-shadow: 0px 0px 18px 0px rgba(145,189,9,1);
    -moz-box-shadow: 0px 0px 18px 0px rgba(145,189,9,1);
    box-shadow: 0px 0px 18px 0px rgba(145,189,9,1);

    &:hover {
        background-color: #85ab13;
    border-color: #85ab13;
    }
}
`;

class EndTurnButton extends Component {
    render() {
        return (
            <Button>End Turn</Button>
        )
    }
}

export default EndTurnButton; 