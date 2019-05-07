import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    createNewDeck, submitDeck, cancelDeckCreation, removeCardFromDeck, editDeck,
    updateDeck, removeDeck
} from '../store/actions/decks';
import CardListDeck from '../components/CardListDeck';
import CardDeckSlots from '../components/CardDeckSlots';
import EditSlots from '../components/EditSlots';

class CardsDeck extends Component {
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
            <CardListDeck
                key={deckItem._id}
                deckContent={deckItem}
                handleClick={editDeck}
                handleDeckDeletion={this.handleDeckDeletion}
            />
        ));
        let creatingDeckSlots = cards.map((card, index) => (
            <CardDeckSlots
                key={card._id + " " + index}
                deckSlot={card}
                deckSlotNumber={index}
                removeCardFromDeck={removeCardFromDeck}
            />
        ));
        let editingDeckSlots = cards.map((card, index) => (
            <EditSlots
                key={card._id + " " + index}
                deckSlot={card}
                deckSlotNumber={index}
                removeCardFromDeck={removeCardFromDeck}
            />
        ));
        return (
            // WHILE IDLE
            <div className="CardDeck">
                {currentState === "idle" && (<div>
                    <div className="DeckList">
                        <h2>Yours decks:</h2><hr />
                        {decks.length === 0 && <p>You don't have any decks yet, go on and create one!</p>}
                        {decks.length !== 0 && currentState === "idle" && (idleDecks)}
                    </div>
                    <div className="DeckCreationPanel">
                        <button onClick={createNewDeck}
                            className="btn btn-deck-create">Create new deck</button>
                    </div>
                </div>)}

                {/* WHILE CREATING NEW DECK */}
                {currentState === "creating" && (<div>
                    <div className="DeckItself">
                        <input type="text" className="mb-2" placeholder="Deck name" name="deckName" onChange={this.handleChange} />
                        {creatingDeckSlots}
                    </div>
                    <div className="DeckCreationPanel-creating">
                        <button onClick={this.handleSubmit} className="btn btn-success btn-deck-create mr-2">Confirm</button>
                        <button onClick={cancelDeckCreation} className="btn btn-danger btn-deck-create ml-2">Cancel</button>
                    </div>
                </div>)}

                {/* WHILE EDITING */}
                {currentState === "editing" && (<div>
                    <div className="DeckItself">
                        <input type="text" className="mb-2" placeholder={editDeckName} name="deckName" onChange={this.handleChange} />
                        {editingDeckSlots}
                        <div className="DeckCreationPanel-creating">
                            <button onClick={this.handleEdit} className="btn btn-success btn-deck-create mr-2">Confirm</button>
                            <button onClick={cancelDeckCreation} className="btn btn-danger btn-deck-create ml-2">Cancel</button>
                        </div>
                    </div>
                </div>)

                }
            </div>
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
})(CardsDeck);
