import React, { Component } from 'react';
import CardItem from './CardItem';

import styled from "styled-components"

const CARDS_IN_ROW = 5;

const Wrapper = styled.div`
    width: 100%;
    max-width: 750px;
    height: 100%;

    color: white;
    text-align: center;

    border-radius: 10px;
    background: #eee;

    margin: auto; 

    display: flex;
    flex-direction: column;

    cursor: pointer;
    opacity: 1;

    justify-content: space-evenly;
`

const Row = styled.div`
    display: flex;
    justify-content: space-evenly; 
    width:100%;

    max-width: 900px;
`

const Top = styled.div`
    display:flex;
    justify-content: flex-end;
    width: 95%;
    max-width: 750px;
`

const DeckNumber = styled.div`
    width: 10%;
    background: ${props => props.isActive ? "#eee" : "#ddd"};
    text-align: center;

    cursor: pointer;

    -webkit-user-select: none;        
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none;

    -moz-border-radius: 0px;
    -webkit-border-radius: 5px 5px 0px 0px;
    border-radius: 5px 5px 0px 0px; 
`

class DeckItem extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef()
        this.state = {
            active: false,
            cardSize: 100,
        };

        this.handleOnClick = this.handleOnClick.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        // console.log(this.ref.current.offsetWidth)
        this.setState({ cardSize: this.ref.current.offsetWidth / CARDS_IN_ROW })
    }

    handleOnClick() {
        const { deck, chooseDeck } = this.props;

        chooseDeck(deck._id);
        this.setState({ active: true });
    };

    render() {
        const { deck, pickedDeck, pickDeck } = this.props;
        const { cardSize } = this.state // this.ref.current.offsetWidth;

        console.log(cardSize)
        let cardsToDisplay = deck.cards.map((card, index) => (
            <CardItem
                key={card._id + index}
                card={card}
                deckSlotNumber={index}
                size={cardSize}
            />
        ));

        let arrayFirstHalf = cardsToDisplay.slice(0, CARDS_IN_ROW);
        let arraySecondHalf = cardsToDisplay.slice(CARDS_IN_ROW, cardsToDisplay.length);

        return (
            <>
                <Top>
                    <DeckNumber isActive={pickedDeck === 0} onClick={() => pickDeck(0)}>1</DeckNumber>
                    <DeckNumber isActive={pickedDeck === 1} onClick={() => pickDeck(1)}>2</DeckNumber>
                    <DeckNumber isActive={pickedDeck === 2} onClick={() => pickDeck(2)}>3</DeckNumber>
                </Top>
                <Wrapper onClick={this.handleOnClick} ref={this.ref} cardSize={cardSize}>
                    <Row>{arrayFirstHalf}</Row>
                    <Row>{arraySecondHalf}</Row>
                </Wrapper>
            </>
        )
    }
}

export default DeckItem;
