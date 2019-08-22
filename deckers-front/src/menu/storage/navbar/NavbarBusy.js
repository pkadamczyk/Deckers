import React, { Component } from 'react';
import CardsDeckSlot from './CardsDeckSlot';

import styled from "styled-components";
import Button from './Button';

const Data = styled.div`
    padding-top:15px;
    text-align: center;
    color:rgb(4, 7, 20);
`

const Panel = styled.div`
    display: flex;
    justify-content: 
    space-evenly;

    width: 100%;
`

class NavbarBusy extends Component {
    constructor(props) {
        super(props);
        const { oldDeckName } = this.props;

        this.state = {
            deckName: oldDeckName ? oldDeckName : ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this)
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleOnClick() {
        const { deckName } = this.state;
        const { handleOnClick } = this.props;

        handleOnClick(deckName)
    }

    render() {
        const { deckName } = this.state;
        const { cards, removeCardFromDeck, cancelDeckCreation } = this.props;

        const deckSlotsList = cards.map((card, index) => (
            <CardsDeckSlot
                key={card._id + " " + index}
                card={card}
                deckSlotNumber={index}
                removeCardFromDeck={removeCardFromDeck}
            />
        ));

        return (
            <>
                <Data>
                    <input type="text" placeholder="Deck name" name="deckName" onChange={this.handleChange} value={deckName} />
                    {deckSlotsList}
                </Data>
                <Panel>
                    <Button text="Confirm" handleOnClick={this.handleOnClick} />
                    <Button text="Cancel" handleOnClick={cancelDeckCreation} />
                </Panel>
            </>
        )
    }
}

export default NavbarBusy;