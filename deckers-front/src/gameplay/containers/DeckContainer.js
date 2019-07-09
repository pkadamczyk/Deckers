import React, {Component} from 'react';
import EnemyDeck from '../components/EnemyDeck';
import PlayerDeck from '../components/PlayerDeck';

class DeckContainer extends Component{
    render(){
        return(
            <div className="DeckContainer">
                <EnemyDeck/>
                <PlayerDeck/>
            </div>
        )
    }
}

export default DeckContainer; 