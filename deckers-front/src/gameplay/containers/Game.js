import React, {Component} from 'react';
import Board from './Board';
import Hand from './Hand';
import {Link} from 'react-router-dom';
import PlayerInfoContainer from './PlayerInfoContainer';
import DeckContainer from './DeckContainer';

class Game extends Component{
    render(){
        return(
            <div className="gameObj">
                <div className="EnemyHand">
                    <Link to="/matchmaking">
                        <button className="btn btn-danger">EXIT</button>
                    </Link>
                </div>
                
                <PlayerInfoContainer/>
                <Board/>
                <DeckContainer/>
                <Hand/>
            </div>
        )
    }
}

export default Game; 