import React, { Component } from 'react';
import Content from './Content';
import SideBar from './SideBar';

import styled from "styled-components"

const Row = styled.div`
    display: flex;
    height: 100%;

    width: 95%;
    margin:auto;
    justify-content: space-evenly;
`

class Matchmaking extends Component {
    render() {
        return (
            <Row >
                <Content />
                <SideBar />
            </Row>
        )
    }
}

export default Matchmaking;