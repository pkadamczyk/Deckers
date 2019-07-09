import React, {Component} from 'react';
import PlayerBoardCard from '../components/PlayerBoardCard';

class PlayerBoard extends Component{
    render(){
        return(
            <div className="PlayerBoard">
                <PlayerBoardCard/>
                <PlayerBoardCard/>
                <PlayerBoardCard/>
                <PlayerBoardCard/>
            </div>
        )
    }
}

export default PlayerBoard; 