import React, { Component } from 'react';

import Deck from "./Deck"
import { connect } from 'react-redux';

class PlayerDeck extends Component {

    render() {
        return (
            <Deck player gold={this.props.gold}></Deck>
        )
    }
}

function mapStateToProps(state) {
    return {
        gold: state.game.playerHeroGold,
    }
}

export default connect(mapStateToProps)(PlayerDeck); 