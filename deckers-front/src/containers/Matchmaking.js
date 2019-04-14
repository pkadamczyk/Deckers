import React, {Component} from 'react';
import DeckList from './DeckList';
import MatchmakingNavbar from '../components/MatchmakingNavbar';
import {setGameMode} from '../store/actions/matchMaking';
import {connect} from 'react-redux';

class Matchmaking extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentMode:"Standard"
        }
    }
   
    handleModeChange(e){
        this.setState({currentMode:e.target.value})
        // let mode = this.state.currentMode;
        this.props.setGameMode(e.target.value);
      }
    render(){
        let handleModeChange = this.handleModeChange.bind(this);
        let {mode} = this.props;
        
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
                    <button className="btn btn-primary" onClick={e => {
                        handleModeChange(e);    
                    } } value="Standard">
                        Standard
                    </button>
                    <button className="btn btn-primary" onClick={e => {
                        handleModeChange(e);    
                    } } value="Defined">
                        Defined
                    </button>
                    <button className="btn btn-primary" onClick={e => {
                        handleModeChange(e);    
                    } } value="Random">
                        Random
                    </button>
                    <button className="btn btn-primary" onClick={e => {
                        handleModeChange(e);    
                    } } value="Mixed">
                        Mixed
                    </button>
                    
                </div>
                <div className="gameModeDesc">
                        <h3>{mode}</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>

                <button class="btn btn-primary mode-picked">Pick this mode</button>
                
                
            </div>
        )
    }
    
}


function mapStateToProps(state) {
    return {
      mode: state.matchMaking.mode
    };
  }

export default connect(mapStateToProps, { setGameMode })(Matchmaking);