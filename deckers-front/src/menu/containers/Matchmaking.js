import React, { Component } from 'react';
import MatchmakingContent from './MatchmakingContent';
import MatchmakingNavbar from '../components/MatchmakingNavbar';

import { connect } from 'react-redux';
// import openSocket from 'socket.io-client';
// const socket = openSocket('http://localhost:8080');
class Matchmaking extends Component {
    // constructor(props){
    //     super(props);
    //     this.state = {
    //         currentMode:"Standard"
    //     }
    // }

    handleModeChange(e) {
        // this.setState({currentMode:e.target.value})
        // let mode = this.state.currentMode;
        // this.props.setGameMode(e.target.value);
    }
    render() {
        // let handleModeChange = this.handleModeChange.bind(this);
        // let { mode } = this.props;
        // const descriptions = ['Standard is a mode in which decks are picked before entering the game, but your hero selection options are dependent of your luck on field of battle!', 'Defined is a game mode which force players to choose both their decks and heroes before entering the battle.', 'In Random game mode both decks and heroes are picked by players after entering the battle, making it harder to complete full deck with symbiosis but more fun!', 'Mixed is a place to look not only for one mode but for as many as you want, whichever will be found sooner, you will be invited to!'];

        return (

            <div className="row">
                <div className="col-9">
                    <MatchmakingContent />
                </div>
                <div className="col-3">
                    <MatchmakingNavbar />
                </div>
            </div>
            // <div className="gameMode">
            //     <h1>Choose game mode:</h1>
            //     <div className="gameModeOptions">
            //         <button className="btn btn-primary" onClick={e => {
            //             handleModeChange(e);
            //         }} value="Standard">
            //             Standard
            //         </button>
            //         <button className="btn btn-primary" onClick={e => {
            //             handleModeChange(e);
            //         }} value="Defined">
            //             Defined
            //         </button>
            //         <button className="btn btn-primary" onClick={e => {
            //             handleModeChange(e);
            //         }} value="Random">
            //             Random
            //         </button>
            //         <button className="btn btn-primary" onClick={e => {
            //             handleModeChange(e);
            //         }} value="Mixed">
            //             Mixed
            //         </button>

            //     </div>
            //     <div className="gameModeDesc">
            //         <h3>{mode}</h3>
            //         <p>{mode === "Standard" && descriptions[0]}</p>
            //         <p>{mode === "Defined" && descriptions[1]}</p>
            //         <p>{mode === "Random" && descriptions[2]}</p>
            //         <p>{mode === "Mixed" && descriptions[3]}</p>
            //     </div>

            //     <button className="btn btn-primary mode-picked" onClick={() => {


            //         socket.emit('join',{});

            //         // socket.on('game-ready',function(gameID) {
            //         //     $(".ready-btn").removeClass( "disabled");
            //         //     $(".ready-btn").attr("href", "/game/" + gameID)
            //         // });

            //         // window.location.replace(...)
            //     }}>Pick this mode</button>


            // </div>
        )
    }

}


function mapStateToProps(state) {
    return {
        
    };
}

export default connect(mapStateToProps, null)(Matchmaking);