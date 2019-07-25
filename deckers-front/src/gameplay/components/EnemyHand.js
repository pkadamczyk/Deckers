import React, { Component } from 'react';

import styled from "styled-components";

const StyledDiv = styled.div`
    height: 18%;
    width: 650px;

    position: absolute;
    left: 0;
    top: 0;

    background: DodgerBlue;
    display: flex;
    padding: 8px;
    overflow: auto;

`;

class EnemyHand extends Component {
    render() {
        return (
            <StyledDiv></StyledDiv>
        )
    }
}

export default EnemyHand; 