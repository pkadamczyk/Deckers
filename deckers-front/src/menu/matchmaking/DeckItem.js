import React, { Component } from 'react';
import CardItem from './CardItem';

import styled from "styled-components"
import background from '../../graphic/nav_background_01.png';

const Wrapper = styled.div`
    display: inline-block;
    height: 95%;
    width:30%;

    background-image: url(${background});
    background-size: cover;
    background-repeat: no-repeat;
    background-color: transparent;

    color: white;
    text-align: center;

    border-radius: 10px;
    margin: 1.25% 1.66%; 
    padding-top:10px;
    cursor: pointer;

    opacity: ${props => props.isPicked ? "1" : "0.65"}
`

const Title = styled.h1`
    background-size: contain;
    background-repeat: no-repeat;
    background-position-y: center;
`

class DeckItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active: false,
        };

        this.handleOnClick = this.handleOnClick.bind(this)
    }

    handleOnClick() {
        const { deck, chooseDeck } = this.props;

        chooseDeck(deck._id);
        this.setState({ active: true });
    };

    render() {
        const { deck, pickedDeck } = this.props;

        let DeckSlots = deck.cards.map((card, index) => (
            <CardItem
                key={card._id + index}
                deckSlot={card}
                deckSlotNumber={index}
            />
        ));

        const isPicked = pickedDeck === deck._id
        return (
            <Wrapper onClick={this.handleOnClick} isPicked={isPicked}>
                <Title>{deck.name}</Title>
                <hr />
                {DeckSlots}
            </Wrapper>
        )
    }
}

export default DeckItem;
