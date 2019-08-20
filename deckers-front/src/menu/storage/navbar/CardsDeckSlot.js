import React, { Component } from 'react';

import styled from "styled-components"

const Wrapper = styled.div`
    background-color: white;
    margin:0px 10px;
    margin-top: 5px;
    widows: 100%;
    height:45px;
    border-radius: 5px;

    display: flex;
`

const Button = styled.button`
    display: inline-block;
    background-color: red;
    color:white;
    height: 45px;
    width: 45px;
    flex-direction: row-reverse;
    margin-left:auto;
`

const Text = styled.p`
    color: black;
    margin:auto;
`


class CardsDeckSlot extends Component {
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
export default CardsDeckSlot;