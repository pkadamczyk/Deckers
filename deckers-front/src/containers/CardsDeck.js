import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createNewDeck, submitDeck, cancelDeckCreation, removeCardFromDeck, editDeck} from '../store/actions/decks';
import CardListDeck from '../components/CardListDeck';
import CardDeckSlots from '../components/CardDeckSlots';

class CardsDeck extends Component{
    constructor(props){
        super(props);
        this.state = {
            deckName:""
        }
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
      };

    handleSubmit = e => {
        let deckToSend= {
            cards:this.props.cards.map(card => card._id),
            name:this.state.deckName
        }
        this.props.submitDeck(this.props.usr_id, deckToSend)
    };

    

    render(){
        const {createNewDeck, decks, currentState, cards, cancelDeckCreation, removeCardFromDeck, editDeck} = this.props;
        let idleDecks = decks.map( deckItem => (
            <CardListDeck 
                key={deckItem._id}
                deckContent={deckItem}
                handleClick={editDeck}
            />
        ));
        let creatingDeckSlots = cards.map( (card, index) => (
            <CardDeckSlots 
                key={card._id + index}
                deckSlot={card}
                deckSlotNumber={index}
                removeCardFromDeck={removeCardFromDeck}
            />
        ));
        return(
            // WHILE IDLE
            <div className="CardDeck">
                {currentState === "idle" && (<div>
                    <div className="DeckList">
                        <h2>Yours decks:</h2><hr/>
                        {decks.length===0 && <p>You don't have any decks yet, go on and create one!</p>}
                        {decks.length!==0 && currentState === "idle" && (idleDecks)}
                    </div>
                    <div className="DeckCreationPanel">
                        <button onClick={createNewDeck}
                        className="btn btn-deck-create">Create new deck</button>
                    </div>
               </div> )}

               {/* WHILE CREATING NEW DECK */}
               {currentState === "creating" && (<div>
                    <div className="DeckItself">
                        <input type="text" className="mb-2" placeholder="Deck name" name="deckName" onChange={this.handleChange}/>
                        {creatingDeckSlots}
                    </div>
                    <div className="DeckCreationPanel-creating">
                        <button onClick={this.handleSubmit} className="btn btn-success btn-deck-create mr-2">Confirm</button>
                        <button onClick={cancelDeckCreation} className="btn btn-danger btn-deck-create ml-2">Cancel</button>
                    </div>
               </div> )}

            {/* WHILE EDITING */}
                {currentState === "editing" && (<div>
                    <div className="DeckItself">
                        <input type="text" className="mb-2" placeholder="{}" name="deckName" onChange={this.handleChange}/>
                        {creatingDeckSlots}
                        <div className="DeckCreationPanel-creating">
                        <button onClick={this.handleSubmit} className="btn btn-success btn-deck-create mr-2">Confirm</button>
                        <button onClick={cancelDeckCreation} className="btn btn-danger btn-deck-create ml-2">Cancel</button>
                        </div>
                    </div>
               </div> )

                }
        </div>
        )
    }
}
function mapStateToProps(state) {
    return{
        currentState:state.decks.currentState,
        decks:state.currentUser.user.decks,
        cards:state.decks.cards,
        usr_id:state.currentUser.user._id,
    }
}

        
export default connect(mapStateToProps, {submitDeck, createNewDeck, cancelDeckCreation, removeCardFromDeck, editDeck })(CardsDeck);