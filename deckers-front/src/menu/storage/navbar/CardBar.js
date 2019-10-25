import React, { Component } from 'react';

import styled from "styled-components"

const Wrapper = styled.div`
    background-color: #eee;
    margin:0px 10px;
    margin-top: 5px;
    height: 8%;
    border-radius: 5px;

    display: flex;
`

const Button = styled.button`
    background-color: #dd0000;
    color:white;
    height: 100%;
    width: 40px;

    border: none;
    border-radius: 5px;
`

const Text = styled.p`
    margin:auto;
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