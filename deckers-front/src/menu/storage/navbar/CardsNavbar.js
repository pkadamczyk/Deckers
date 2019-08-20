import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    createNewDeck, submitDeck, cancelDeckCreation, removeCardFromDeck, editDeck,
    updateDeck, removeDeck
} from '../../../store/actions/decks';
import CardsDeckItem from './CardsDeckItem';
import CardsDeckSlot from './CardsDeckSlot';

import styled from "styled-components"
import wrapperBackground from '../../../graphic/nav_background_03.png';
import headerBackground from '../../../graphic/button_03.png';
import buttonBackground from '../../../graphic/button_04.png';

const Wrapper = styled.div`
    background-image: url(${wrapperBackground});
    background-repeat: repeat-y;
    background-size:contain;
    
    width:100%;
    height: 100%;
    color: white;
    text-align: center;
    width: 20%;

    margin-left:auto;
`

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

const Button = styled.button`
    background-image: url(${buttonBackground});
    background-size: cover;
    background-repeat: no-repeat;

    margin: auto 10% 10% 10%;
    border: none;
    border-radius: 10px;
    font-size: 1.2rem;
    height:3.6rem;
`

const Create = styled.div`
    padding-top:15px;
    text-align: center;
    color:rgb(4, 7, 20);
`

const CreatePanel = styled.div`
    width: 100%;
    position: absolute;
    top: 560px;
`

class CardsNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deckName: ""
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCreateNewDeck = this.handleCreateNewDeck.bind(this);
        this.handleCancelDeckCreation = this.handleCancelDeckCreation.bind(this)
        this.handleRemoveCardFromDeck = this.handleRemoveCardFromDeck.bind(this)
        this.handleEditDeck = this.handleEditDeck.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit() {
        const { deckName } = this.state;
        const { cards, userId } = this.props;

        if (cards.length !== 10) return alert("Invalid cards amount!");
        if (deckName.length === 0) return alert("Deck name cannot be blank!");

        const deckToSend = {
            cards: cards.map(card => card._id),
            name: deckName
        }
        this.props.dispatch(submitDeck(userId, deckToSend))
    };

    handleEdit = () => {
        const { cards, userId, deckId, oldDeckName } = this.props;
        const { deckName } = this.state;

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

    handleCreateNewDeck() {
        this.props.dispatch(createNewDeck())
    }

    handleCancelDeckCreation() {
        this.props.dispatch(cancelDeckCreation())
    }

    handleRemoveCardFromDeck(position) {
        this.props.dispatch(removeCardFromDeck(position))
    }

    handleEditDeck(cards, name, _id) {
        this.props.dispatch(editDeck(cards, name, _id))
    }

    render() {
        const { decks, currentState, cards, oldDeckName } = this.props;

        const idleDecksList = decks.map(deckItem => (
            <CardsDeckItem
                key={deckItem._id}
                deckContent={deckItem}
                handleClick={this.handleEditDeck}
                handleDeckDeletion={this.handleDeckDeletion}
            />
        ));

        const deckSlotsList = cards.map((card, index) => (
            <CardsDeckSlot
                key={card._id + " " + index}
                card={card}
                deckSlotNumber={index}
                removeCardFromDeck={this.handleRemoveCardFromDeck}
            />
        ));

        const placeholder = currentState === "creating" ? " Deck name" : oldDeckName;
        const handleOnClick = currentState === "creating" ? this.handleSubmit : this.handleEdit
        return (
            <Wrapper>
                {currentState === "idle" && (
                    <Idle>
                        <List>
                            <Header>
                                <p>Yours decks:</p>
                            </Header>
                            {decks.length === 0 && <p>You don't have any decks yet, go on and create one!</p>}
                            {decks.length !== 0 && (idleDecksList)}
                        </List>
                        <Button onClick={this.handleCreateNewDeck}>Create new deck</Button>
                    </Idle>)}

                {(currentState === "creating" || currentState === "editing") && (
                    <>
                        <Create>
                            <input type="text" placeholder={placeholder} name="deckName" onChange={this.handleChange} />
                            {deckSlotsList}
                        </Create>
                        <CreatePanel>
                            <Button onClick={handleOnClick} >Confirm</Button>
                            <Button onClick={this.handleCancelDeckCreation} >Cancel</Button>
                        </CreatePanel>
                    </>
                )}
            </Wrapper>
        )
    }
}
function mapStateToProps(state) {
    return {
        currentState: state.decks.currentState,
        decks: state.currentUser.user.decks,
        cards: state.decks.cards,
        userId: state.currentUser.user._id,
        oldDeckName: state.decks.name,
        deckId: state.decks.deck_id,
    }
}


export default connect(mapStateToProps)(CardsNavbar);
