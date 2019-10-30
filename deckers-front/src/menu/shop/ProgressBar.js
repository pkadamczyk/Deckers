import React, { Component } from 'react';

import styled from "styled-components";

const Background = styled.div`
    width: calc(100% - 20px);
    margin: 10px;
    border: 1px solid #333;
    border-radius: 5px;
    background: #ddd;

    height: 25px;
    position: relative;
`

const Filler = styled.div`
    width: ${props => props.width + "%"};
    height: 100%;
    border-radius: 5px;
    Background: #8FC320
`

const Text = styled.div`
    margin-top: -24px;

    -webkit-user-select: none;        
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none;
`

class ProgressBar extends Component {

    render() {
        const { max, value } = this.props;
        const fillerWidth = (value / max) * 100 > 100 ? 100 : (value / max) * 100;

        return (
            <Background>
                <Filler width={fillerWidth} />
                <Text>{value} / {max}</Text>
            </Background>
        );
    }
}

export default ProgressBar;