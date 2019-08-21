import React, { Component } from 'react';
import CardsDeckItem from './CardsDeckItem';

import styled from "styled-components";
import headerBackground from '../../../graphic/button_03.png';
import Button from './Button';

const Idle = styled.div`
    height:100%;
    display: flex;
    width:100%;
    flex-direction: column;
    justify-content: center;
`

const List = styled.div`
    padding-right: 0.2rem;
    width: 100%;
`

const Header = styled.div`
    width: 80%;
    background-image: url(${headerBackground});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    height: 4.70rem;
    font-size:1.5rem;
    padding-top: 1rem;
    margin: auto;
`

class NavbarIdle extends Component {
    render() {
        const { decks, startDeckEdition, deleteDeck, startDeckCreation } = this.props;

        const idleDecksList = decks.map(deckItem => (
            <CardsDeckItem
                key={deckItem._id}
                deckContent={deckItem}
                startDeckEdition={startDeckEdition}
                handleDeckDeletion={deleteDeck}
            />
        ));

        return (
            <Idle>
                <List>
                    <Header>
                        <p>Yours decks:</p>
                    </Header>
                    {decks.length === 0 && <p>You don't have any decks yet, go on and create one!</p>}
                    {decks.length !== 0 && (idleDecksList)}
                </List>
                <Button text="Create new deck" handleOnClick={startDeckCreation} />
            </Idle>
        )
    }
}

export default NavbarIdle;