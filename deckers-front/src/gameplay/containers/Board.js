import React, {Component} from 'react';
import PlayerBoard from './PlayerBoard';
import EnemyBoard from './EnemyBoard';

class Board extends Component{
    render(){
        return(
            <div>
                <PlayerBoard/>
                <EnemyBoard/>
            </div>
        )
    }
}

export default Board; 