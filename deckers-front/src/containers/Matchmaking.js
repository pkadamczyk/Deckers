import React, {Component} from 'react';
import DeckList from './DeckList';
import MatchmakingNavbar from '../components/MatchmakingNavbar';

class Matchmaking extends Component{
    render(){
        return(
            <div className="row">
                <div className="col-9">
                    <DeckList />
                </div>
                <div className="col-3">
                    <MatchmakingNavbar />
                </div>
            </div>
        )
    }
    
}

export default Matchmaking;