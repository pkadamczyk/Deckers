import React, {Component} from 'react';

class MatchmakingDeckSlot extends Component{
    render(){
        const {deckSlot} = this.props;
        return(
            <div className="mm-deckSlot">
                <div className="mm-card-name"><p>{deckSlot.name}</p></div>
            </div>
        )
    }
}
export default MatchmakingDeckSlot;