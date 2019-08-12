import React, { Component } from 'react';
import DeckContainer from './DeckContainer';
import Navbar from './Navbar';

import styled from "styled-components"

const Row = styled.div`
    display: flex;
    height: 100%;
`

class Matchmaking extends Component {
    render() {
        return (
            <Row >
                <DeckContainer />
                <Navbar />
            </Row>
        )
    }
}

export default Matchmaking;