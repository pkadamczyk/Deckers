import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    createNewDeck, submitDeck, cancelDeckCreation, removeCardFromDeck, editDeck,
    updateDeck, removeDeck
} from '../../../store/actions/decks';
import CardsDeckItem from './CardsDeckItem';
import CardsDeckSlot from '../../components/CardsDeckSlot';
import CardsDeckSlotInEdit from '../../components/CardsDeckSlotInEdit';

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
    width: 20.84%;
    height: 100%;
    position: fixed;
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
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = () => {
        if (this.props.cards.length !== 10) {
            alert("Invalid cards amount!");
        } else {
            if (this.state.deckName.length === 0) {
                alert("Deck name cannot be blank!");
            } else {
                let deckToSend = {
                    cards: this.props.cards.map(card => card._id),
                    name: this.state.deckName
                }
                this.props.submitDeck(this.props.usr_id, deckToSend)
            }
        }
    };
    handleEdit = () => {
        if (this.props.cards.length !== 10) {
            alert("Invalid cards amount!");
        } else {
            let newName;
            this.state.deckName === "" ? newName = this.props.editDeckName : newName = this.state.deckName;
            let deckToSend = {
                cards: this.props.cards.map(card => card._id),
                name: newName
            }
            this.props.updateDeck(this.props.usr_id, this.props.deck_id, deckToSend)
        }
    }
    handleDeckDeletion = (deck_id) => {
        this.props.removeDeck(this.props.usr_id, deck_id)
    }

    render() {
        const { createNewDeck, decks, currentState, cards, cancelDeckCreation, removeCardFromDeck,
            editDeck, editDeckName } = this.props;
        let idleDecks = decks.map(deckItem => (
            <CardsDeckItem
                key={deckItem._id}
                deckContent={deckItem}
                handleClick={editDeck}
                handleDeckDeletion={this.handleDeckDeletion}
            />
        ));
        let creatingDeckSlots = cards.map((card, index) => (
            <CardsDeckSlot
                key={card._id + " " + index}
                deckSlot={card}
                deckSlotNumber={index}
                removeCardFromDeck={removeCardFromDeck}
            />
        ));
        let editingDeckSlots = cards.map((card, index) => (
            <CardsDeckSlotInEdit
                key={card._id + " " + index}
                deckSlot={card}
                deckSlotNumber={index}
                removeCardFromDeck={removeCardFromDeck}
            />
        ));


        const placeholder = currentState === "creating" ? " Deck name" : editDeckName;
        return (
            // WHILE IDLE
            <Wrapper>
                {currentState === "idle" && (
                    <Idle>
                        <List>
                            <Header>
                                <p>Yours decks:</p>
                            </Header>
                            {decks.length === 0 && <p>You don't have any decks yet, go on and create one!</p>}
                            {decks.length !== 0 && (idleDecks)}
                        </List>
                        <Button onClick={createNewDeck}>Create new deck</Button>
                    </Idle>)}

                {/* WHILE CREATING NEW DECK */}
                {currentState === "creating" && (
                    <div>
                        <Create>
                            <input type="text" placeholder={placeholder} name="deckName" onChange={this.handleChange} />
                            {creatingDeckSlots}
                        </Create>
                        <CreatePanel>
                            <Button onClick={this.handleSubmit} >Confirm</Button>
                            <Button onClick={cancelDeckCreation} >Cancel</Button>
                        </CreatePanel>
                    </div>
                )}

                {/* WHILE EDITING */}
                {currentState === "editing" && (<div>
                    <div className="DeckItself">
                        <input type="text" className="mb-2" placeholder={placeholder} name="deckName" onChange={this.handleChange} />
                        {editingDeckSlots}
                        <div className="DeckCreationPanel-creating">
                            <button onClick={this.handleEdit} className="btn btn-success btn-deck-create mr-2">Confirm</button>
                            <button onClick={cancelDeckCreation} className="btn btn-danger btn-deck-create ml-2">Cancel</button>
                        </div>
                    </div>
                </div>)

                }
            </Wrapper>
        )
    }
}
function mapStateToProps(state) {
    return {
        currentState: state.decks.currentState,
        decks: state.currentUser.user.decks,
        cards: state.decks.cards,
        usr_id: state.currentUser.user._id,
        editDeckName: state.decks.name,
        deck_id: state.decks.deck_id,
    }
}


export default connect(mapStateToProps, {
    updateDeck, submitDeck, createNewDeck, cancelDeckCreation,
    removeCardFromDeck, editDeck, removeDeck
})(CardsNavbar);
