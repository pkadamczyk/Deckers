import React, { Component } from 'react';
import PlayerBoard from './PlayerBoard';
import EnemyBoard from './EnemyBoard';

import styled from "styled-components"

const Title = styled.div`
    display: inline-block;
    
    top:100px;
    height: 325px;
    width: 60%;
    border: 1px solid red;
    background-color: brown;
`;

class Board extends Component {
    render() {
        return (
            <Title>
                <EnemyBoard />
                <PlayerBoard />
            </Title>
        )
    }
}

export default Board; 