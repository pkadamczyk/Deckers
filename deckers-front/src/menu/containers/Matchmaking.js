import React, { Component } from 'react';
import MatchmakingContent from './MatchmakingContent';
import MatchmakingNavbar from '../components/MatchmakingNavbar';

class Matchmaking extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-10">
                    <MatchmakingContent />
                </div>
                <div className="col-2">
                    <MatchmakingNavbar />
                </div>
            </div>
        )
    }

}
export default Matchmaking;