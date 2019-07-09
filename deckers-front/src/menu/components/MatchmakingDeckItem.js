import React, {Component} from 'react';
import MatchmakingDeckSlot from './MatchmakingDeckSlot';
import {connect} from 'react-redux';
import {chooseDeck} from '../../store/actions/matchmaking';
import {tC, cL} from 'react-classlist-helper';

class MatchmakingDeckItem extends Component{
    constructor(props) {
        super(props);
        //this.addActiveClass= this.addActiveClass.bind(this);
        this.state = {
            active: false,
        };
    }

    toggleClass() {
        // const currentState = this.state.active;
        this.setState({ active: true });
    };

    render(){
        const {deck, chooseDeck} = this.props;
        let DeckSlots = deck.cards.map( (card, index) => (
            <MatchmakingDeckSlot 
                key={card._id + " " +index}
                deckSlot={card}
                deckSlotNumber={index}
            />
        ));
        let activeClass = "active-filter";

        return(
            // className={this.state.active ? 'your_className': null} 
            <div className={cL("mm-deck-item", tC(activeClass, this.state.active))} onClick={()=>{
                    chooseDeck(deck._id);
                    this.setState({ active: true });
                }}>
                <h1 className="mm-deck-name">{deck.name}</h1>
                <hr/>
                {DeckSlots}
            </div>
        )
    }
}
function mapStateToProps(state){
    return{
        decks : state.currentUser.user.decks,
    }
}

export default connect(mapStateToProps, {chooseDeck}) (MatchmakingDeckItem);
