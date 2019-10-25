import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    startDeckCreation, submitDeck, cancelDeckCreation, removeCardFromDeck, editDeck,
    updateDeck, removeDeck
} from '../../../store/actions/storage';

import styled from "styled-components"
import wrapperBackground from '../../../graphic/nav_background_03.png';
import { STORAGE_STATE } from '../../../store/reducers/storage';
import NavbarIdle from './NavbarIdle';
import NavbarBusy from './NavbarBusy';

const Wrapper = styled.div`
    background-image: url(${wrapperBackground});
    background-repeat: repeat-y;
    background-size:contain;
    
    text-align: center;
    width: 18%;

    margin-left:auto;
`

class CardsNavbar extends Component {
    constructor(props) {
        super(props);

        this.handleDeckSubmit = this.handleDeckSubmit.bind(this)
        this.handleStartDeckCreation = this.handleStartDeckCreation.bind(this);
        this.handleCancelDeckCreation = this.handleCancelDeckCreation.bind(this)
        this.handleRemoveCardFromDeck = this.handleRemoveCardFromDeck.bind(this)
        this.handleStartDeckEdition = this.handleStartDeckEdition.bind(this);
    }

    handleDeckSubmit(deckName) {
        const { cards, userId } = this.props;

        if (cards.length !== 10) return alert("Invalid cards amount!");
        if (deckName.length === 0) return alert("Deck name cannot be blank!");

        const deckToSend = {
            cards: cards.map(card => card._id),
            name: deckName
        }
        this.props.dispatch(submitDeck(userId, deckToSend))
    };

    handleDeckEdit = (deckName) => {
        const { cards, userId, deckId, oldDeckName } = this.props;

        if (cards.length !== 10) return alert("Invalid cards amount!");
        const name = deckName === "" ? oldDeckName : deckName;

        const deckToSend = {
            cards: cards.map(card => card._id),
            name
        }

        this.props.dispatch(updateDeck(userId, deckId, deckToSend))
    }

    handleDeckDeletion = (deckId) => {
        const { userId } = this.props;

        this.props.dispatch(removeDeck(userId, deckId))
    }

    handleStartDeckCreation() {
        this.props.dispatch(startDeckCreation())
    }

    handleCancelDeckCreation() {
        this.props.dispatch(cancelDeckCreation())
    }

    handleRemoveCardFromDeck(position) {
        this.props.dispatch(removeCardFromDeck(position))
    }

    handleStartDeckEdition(cards, name, _id) {
        this.props.dispatch(editDeck(cards, name, _id))
    }

    render() {
        const { currentState, cards, decks, oldDeckName } = this.props;

        const handleOnClick = currentState === STORAGE_STATE.CREATING ? this.handleDeckSubmit : this.handleDeckEdit
        return (
            <Wrapper>
                {currentState === STORAGE_STATE.IDLE && (
                    <NavbarIdle
                        decks={decks}
                        startDeckEdition={this.handleStartDeckEdition}
                        startDeckCreation={this.handleStartDeckCreation}
                        deleteDeck={this.handleDeckDeletion}
                    />)}

                {(currentState !== STORAGE_STATE.IDLE) && (
                    <NavbarBusy
                        handleOnClick={handleOnClick}
                        cards={cards}
                        removeCardFromDeck={this.handleRemoveCardFromDeck}
                        cancelDeckCreation={this.handleCancelDeckCreation}
                        oldDeckName={oldDeckName}
                    />
                )}
            </Wrapper>
        )
    }
}
function mapStateToProps(state) {
    return {
        currentState: state.storage.currentState,
        decks: state.currentUser.user.decks,
        cards: state.storage.cards,
        userId: state.currentUser.user._id,
        oldDeckName: state.storage.oldDeckName,
        deckId: state.storage.deck_id,
    }
}


export default connect(mapStateToProps)(CardsNavbar);
