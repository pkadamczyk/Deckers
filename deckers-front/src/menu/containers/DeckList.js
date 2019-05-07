import React, {Component} from 'react';
import DeckItem from '../components/DeckItem';
import {connect} from 'react-redux';

class DeckList extends Component{
    render(){
        const {decks} = this.props;
        let deckList = decks.map( deckItem => (
            <DeckItem
                deck={deckItem}
                key={deckItem._id}    
            />
        ))
        return(
            <div className="mm-deckList">
                {deckList}
            </div>
            
        )
    }
}
function mapStateToProps(state){
    return{
        decks : state.currentUser.user.decks,
    }
}

export default connect(mapStateToProps, null) (DeckList);