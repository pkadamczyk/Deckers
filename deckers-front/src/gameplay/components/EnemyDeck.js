import React, { Component } from 'react';
import styled from "styled-components"
import Deck from "./Deck"

const Div = styled.div`
position: absolute;
    right: 0;
top: 18%;
`
class EnemyDeck extends Component {
    render() {
        return (
            <Div>
                <Deck />
            </Div>

        )
    }
}

export default EnemyDeck; 