import React, { Component } from 'react';

import styled from "styled-components"
import { device } from '../../../mediaQueries';

const Wrapper = styled.div`
    background-color: #eee;
    margin: 0px 10px;
    margin-top: 5px;

    border-radius: 5px;

    display: flex;
`

const Button = styled.button`
    background-color: #dd0000;
    color:white;
    width: 40px;

    border: none;
    border-radius: 5px;

    @media ${device.laptopL} {
        width: 50px;
    };
    @media ${device.desktopS} {
        width: 60px;
    }
`

const Text = styled.p`
    margin:auto;
    font-size: 22px;
    padding: 1% 0;

    @media ${device.laptopL} {
        font-size: 18px;
        padding: 2% 0;
    };
    @media ${device.desktopS} {
        font-size: 24px;
        padding: 3% 0;
    }
`

class CardBar extends Component {
    constructor(props) {
        super(props);

        this.handleOnClick = this.handleOnClick.bind(this)
    }

    handleOnClick() {
        const { deckSlotNumber, removeCardFromDeck } = this.props;

        removeCardFromDeck(deckSlotNumber)
    }

    render() {
        const { card } = this.props;
        return (
            <Wrapper>
                <Text>{card.name}</Text>
                <Button onClick={this.handleOnClick}>
                    X
                </Button>
            </Wrapper>
        )
    }
}
export default CardBar;