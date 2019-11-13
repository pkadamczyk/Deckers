import React, { Component } from 'react';
import DeckItem from './DeckItem';

import styled from "styled-components";

const Idle = styled.div`
    height:100%;
    display: flex;
    width:100%;
    flex-direction: column;
`

const List = styled.div`
    padding-right: 0.2rem;
    width: 100%;
`

class NavbarIdle extends Component {
    render() {
        const { decks, startDeckEdition, deleteDeck, startDeckCreation } = this.props;

        const idleDecksList = decks.map(deckItem => (
            <DeckItem
                key={deckItem._id}
                deckContent={deckItem}
                startDeckEdition={startDeckEdition}
                handleDeckDeletion={deleteDeck}
            />
        ));

        return (
            <Idle>
                <List>
                    {decks.length === 0 && <p>You don't have any decks yet, go on and create one!</p>}
                    {decks.length !== 0 && (idleDecksList)}
                </List>
            </Idle>
        )
    }
}

export default NavbarIdle;