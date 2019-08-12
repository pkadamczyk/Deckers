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
        const { decks } = this.props;

        let deckList = decks.map(deck => (
            <DeckItem
                deck={deck}
                key={deck._id}
                chooseDeck={this.handleChooseDeck}
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
    }
}

export default connect(mapStateToProps)(DeckContainer);