import React, { Component } from 'react';
import DeckItem from './DeckItem';
import { connect } from 'react-redux';

import styled from "styled-components"
import { chooseDeck } from '../../store/actions/matchmaking';

const Content = styled.div`
    width: 80%;
`

class DeckContainer extends Component {
    constructor(props) {
        super(props);

        this.handleChooseDeck = this.handleChooseDeck.bind(this)
    }

    handleChooseDeck(id) {
        this.props.dispatch(chooseDeck(id))
    }

    render() {
        const { decks, pickedDeck } = this.props;

        let deckList = decks.map(deck => (
            <DeckItem
                deck={deck}
                key={deck._id}
                chooseDeck={this.handleChooseDeck}
                pickedDeck={pickedDeck}
            />
        ))

        return (
            <Content >
                {deckList}
            </Content>
        )
    }
}

function mapStateToProps(state) {
    return {
        decks: state.currentUser.user.decks,
        pickedDeck: state.matchmaking.deck,
    }
}

export default connect(mapStateToProps)(DeckContainer);