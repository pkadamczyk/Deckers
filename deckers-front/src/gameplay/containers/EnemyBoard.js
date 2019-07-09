import React, {Component} from 'react';
import EnemyBoardCard from '../components/EnemyBoardCard';

class EnemyBoard extends Component{
    render(){
        return(
            <div className="EnemyBoard">
                <EnemyBoardCard/>
                <EnemyBoardCard/>
                <EnemyBoardCard/>
                <EnemyBoardCard/>
            </div>
        )
    }
}

export default EnemyBoard; 