import React, { Component } from 'react';
import PlayerBoard from './PlayerBoard';
import EnemyBoard from './EnemyBoard';


class Board extends Component {
    render() {
        return (
            <div className="Board">
                <EnemyBoard />
                <PlayerBoard />
                
            </div>
        )
    }
}

export default Board; 