import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createNewDeck, submitDeck, cancelDeckCreation, removeCardFromDeck} from '../store/actions/decks';

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
        const {createNewDeck, decks, currentState, cards, cancelDeckCreation, removeCardFromDeck} = this.props;
        return(
            
            <div className="CardDeck">
                {currentState === "idle" && (<div>
                    <div className="DeckList">
                        <h2>Yours decks:</h2><hr/>
                        {decks.length===0 && <p>You don't have any decks yet, go on and create one!</p>}
                        {/* <p>{decks[0].card.name}</p> */}
                    </div>
                    <div className="DeckCreationPanel">
                        <button onClick={createNewDeck} className="btn btn-deck-create">Create new deck</button>
                    </div>
               </div> )}
               {currentState === "creating" && (<div>
                    <div className="DeckItself">
                        {/* Refactor is going to happen (maybe) */}
                        <input type="text" className="mb-2" placeholder="Deck name" name="deckName" onChange={this.handleChange}/>
                        <div className="deckSlot">{cards[0] ? (<div className="row"><div className="col-10 card-name">{cards[0].card.name}</div><button onClick={() => {removeCardFromDeck(0)}} className="btn btn-danger cancel-card col-2">X</button></div>) : (<div className="card-name">Empty</div>)}</div>
                        <div className="deckSlot">{cards[1] ? (<div className="row"><div className="col-10 card-name">{cards[1].card.name}</div><button onClick={() => {removeCardFromDeck(1)}} className="btn btn-danger cancel-card col-2">X</button></div>) : (<div className="card-name">Empty</div>)}</div>
                        <div className="deckSlot">{cards[2] ? (<div className="row"><div className="col-10 card-name">{cards[2].card.name}</div><button onClick={() => {removeCardFromDeck(2)}} className="btn btn-danger cancel-card col-2">X</button></div>) : (<div className="card-name">Empty</div>)}</div>
                        <div className="deckSlot">{cards[3] ? (<div className="row"><div className="col-10 card-name">{cards[3].card.name}</div><button onClick={() => {removeCardFromDeck(3)}} className="btn btn-danger cancel-card col-2">X</button></div>) : (<div className="card-name">Empty</div>)}</div>
                        <div className="deckSlot">{cards[4] ? (<div className="row"><div className="col-10 card-name">{cards[4].card.name}</div><button onClick={() => {removeCardFromDeck(4)}} className="btn btn-danger cancel-card col-2">X</button></div>) : (<div className="card-name">Empty</div>)}</div>
                        <div className="deckSlot">{cards[5] ? (<div className="row"><div className="col-10 card-name">{cards[5].card.name}</div><button onClick={() => {removeCardFromDeck(5)}} className="btn btn-danger cancel-card col-2">X</button></div>) : (<div className="card-name">Empty</div>)}</div>
                        <div className="deckSlot">{cards[6] ? (<div className="row"><div className="col-10 card-name">{cards[6].card.name}</div><button onClick={() => {removeCardFromDeck(6)}} className="btn btn-danger cancel-card col-2">X</button></div>) : (<div className="card-name">Empty</div>)}</div>
                        <div className="deckSlot">{cards[7] ? (<div className="row"><div className="col-10 card-name">{cards[7].card.name}</div><button onClick={() => {removeCardFromDeck(7)}} className="btn btn-danger cancel-card col-2">X</button></div>) : (<div className="card-name">Empty</div>)}</div>
                        <div className="deckSlot">{cards[8] ? (<div className="row"><div className="col-10 card-name">{cards[8].card.name}</div><button onClick={() => {removeCardFromDeck(8)}} className="btn btn-danger cancel-card col-2">X</button></div>) : (<div className="card-name">Empty</div>)}</div>
                        <div className="deckSlot">{cards[9] ? (<div className="row"><div className="col-10 card-name">{cards[9].card.name}</div><button onClick={() => {removeCardFromDeck(9)}} className="btn btn-danger cancel-card col-2">X</button></div>) : (<div className="card-name">Empty</div>)}</div>
                    </div>
                    <div className="DeckCreationPanel-creating">
                        <button onClick={this.handleSubmit} className="btn btn-success btn-deck-create mr-2">Confirm</button>
                        <button onClick={cancelDeckCreation} className="btn btn-danger btn-deck-create ml-2">Cancel</button>
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
        usr_id:state.currentUser.user._id,
        nextAvailableSlot:state.decks.nextAvailableSlot,
    }
}

        
export default connect(mapStateToProps, {submitDeck, createNewDeck, cancelDeckCreation, removeCardFromDeck })(CardsDeck);