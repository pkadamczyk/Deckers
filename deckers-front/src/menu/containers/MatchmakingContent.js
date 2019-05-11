import React, {Component} from 'react';
import MatchmakingDeckItem from '../components/MatchmakingDeckItem';
import {connect} from 'react-redux';

class MatchmakingContent extends Component{
    render(){
        const {decks, chooseDeck} = this.props;
        let deckList = decks.map( deckItem => (
            <MatchmakingDeckItem
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

export default connect(mapStateToProps, null) (MatchmakingContent);