import React, {Component} from 'react';
import DeckList from './DeckList';
import MatchmakingNavbar from '../components/MatchmakingNavbar';

class Matchmaking extends Component{
    constructor(props) {
        super(props);
        this.state = {
          gameMode: ""
        };
      }

      setGameMode(){
          
      }

    render(){
        return(
            // <div className="row">
            //     <div className="col-9">
            //         <DeckList />
            //     </div>
            //     <div className="col-3">
            //         <MatchmakingNavbar />
            //     </div>
            // </div>
            <div className="gameMode">
                <h1>Choose game mode:</h1>
                <div className="gameModeOptions">
                    <div className="btn btn-primary">
                        Standard
                    </div>
                    <div className="btn btn-primary">
                        Defined
                    </div>
                    <div className="btn btn-primary">
                        Random
                    </div>
                    <div className="btn btn-primary">
                        Mixed
                    </div>
                </div>
                <div className="gameModeDesc">
                <h3>{this.state.gameMode}</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>

            </div>
        )
    }
    
}

export default Matchmaking;