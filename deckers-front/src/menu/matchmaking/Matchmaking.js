import React, { Component } from 'react';
import Content from './Content';
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
                <Content />
                <Navbar />
            </Row>
        )
    }
}

export default Matchmaking;