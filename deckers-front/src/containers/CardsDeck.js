import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createNewDeck, submitDeck} from '../store/actions/decks';

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
        const {createNewDeck, decks, currentState, cards} = this.props;
        return(
            
            <div className="CardDeck">
                {currentState === "idle" && (<div>
                    <div className="DeckList">
                        <h2>Yours decks:</h2><hr/>
                        {decks.length===0 && <p>You don't have any decks yet, go on and create one!</p>}
                    </div>
                    <div className="DeckCreationPanel">
                        <button onClick={createNewDeck} className="btn btn-deck-create">Create new deck</button>
                    </div>
               </div> )}
               {currentState === "creating" && (<div>
                    <div className="DeckItself">
                        <input type="text" className="mb-2" placeholder="Deck name" name="deckName" onChange={this.handleChange}/>
                        <div className="deckSlot">{cards[0] ? cards[0].card.name : "Empty"}</div>
                        <div className="deckSlot">{cards[1] ? cards[1].card.name : "Empty"}</div>
                        <div className="deckSlot">{cards[2] ? cards[2].card.name : "Empty"}</div>
                        <div className="deckSlot">{cards[3] ? cards[3].card.name : "Empty"}</div>
                        <div className="deckSlot">{cards[4] ? cards[4].card.name : "Empty"}</div>
                        <div className="deckSlot">{cards[5] ? cards[5].card.name : "Empty"}</div>
                        <div className="deckSlot">{cards[6] ? cards[6].card.name : "Empty"}</div>
                        <div className="deckSlot">{cards[7] ? cards[7].card.name : "Empty"}</div>
                        <div className="deckSlot">{cards[8] ? cards[8].card.name : "Empty"}</div>
                        <div className="deckSlot">{cards[9] ? cards[9].card.name : "Empty"}</div>
                    </div>
                    <div className="DeckCreationPanel-creating">
                        <button onClick={this.handleSubmit} className="btn btn-deck-create">Confirm</button>
                    </div>
               </div> )}
            </div>
        )
    }
}
function mapStateToProps(state) {
    return{
        currentState:state.decks.currentState,
        decks:state.currentUser.user.decks,
        cards:state.decks.cards,
        usr_id:state.currentUser.user._id
    }
}

export default connect(mapStateToProps, {submitDeck, createNewDeck})(CardsDeck);