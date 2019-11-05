import React, { Component } from 'react';

import styled from "styled-components"
import ChestSlot from './ChestSlot';

const Wrapper = styled.div`
    width: 100%;
    height: 60%;

    display:flex;
    flex-direction: column;
    justify-content: space-evenly;

    background: #ddd;
    border-radius: 10px;
`

const Row = styled.div`
    display: flex;
    height: 46%;
    justify-content: space-evenly;
`

class ChestRack extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Wrapper>
                <Row>
                    <ChestSlot />
                    <ChestSlot />
                </Row>
                <Row>
                    <ChestSlot />
                    <ChestSlot />
                </Row>
            </Wrapper>
        )
    }
}

export default ChestRack;
