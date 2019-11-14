import React, { Component } from 'react';

import styled from "styled-components"
import { device } from '../../mediaQueries';

const Wrapper = styled.div`
    width: 100%;
    height: 60%;

    display:flex;
    flex-direction: column;
    justify-content: space-evenly;

    background: #ddd;
    border-radius: 10px;
`

const Text = styled.div`
    width: 80%;
    margin: 0 auto;
    font-size: 20px;

    @media ${device.laptopL} {
        font-size: 22px;
    }
    @media ${device.desktopS} {
        font-size: 26px;
    }
    @media ${device.desktopL} {
        font-size: 28px;
    }
`

const Title = styled.h2`
    text-align: center;
    font-size: 32px;

    @media ${device.laptopL} {
        font-size: 36px;
    }
    @media ${device.desktopS} {
        font-size: 40px;
    }
    @media ${device.desktopL} {
        font-size: 46px;
    }
`

class ChestRack extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Wrapper>
                <Title>Before you play</Title>
                <Text>
                    Gameplay was developed and works best on 1400 x 660 or similar resolution.
                    If possible please adjust your browser size in console.
                    <br />
                    Currently only online version is available.
                </Text>
            </Wrapper>
        )
    }
}

export default ChestRack;
