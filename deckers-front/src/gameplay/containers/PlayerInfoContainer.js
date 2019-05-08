import React, {Component} from 'react';
import Player1Info from '../components/Player1Info';
import Player2Info from '../components/Player2Info';

class PlayerInfoContainer extends Component{
    render(){
        return(
            <div>
                <Player1Info/>
                <Player2Info/>
            </div>
        )
    }
}

export default PlayerInfoContainer; 