import React, { Component } from 'react';
import DeckItem from './DeckItem';
import { connect } from 'react-redux';

import styled from "styled-components"
import { chooseDeck } from '../../store/actions/matchmaking';

const DeckMenager = styled.div`
    width: 70%;
    height: 75%;
    margin: 4% auto;
`

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickedDeck: 0,
        }

        this.handleChooseDeck = this.handleChooseDeck.bind(this)
        this.handleDeckChange = this.handleDeckChange.bind(this)
    }

    handleChooseDeck(id) {
        this.props.dispatch(chooseDeck(id))
    }

    handleDeckChange(newDeckNum) {
        this.props.dispatch(chooseDeck(newDeckNum))
        this.setState({ pickedDeck: newDeckNum });
    }

    render() {
        const { decks } = this.props;
        const { pickedDeck } = this.state;
        const currentDeck = decks[pickedDeck];

        return (
            <DeckMenager>
                <DeckItem
                    deck={currentDeck}
                    key={currentDeck._id}
                    chooseDeck={this.handleChooseDeck}
                    pickDeck={this.handleDeckChange}
                    pickedDeck={pickedDeck}
                />
            </DeckMenager>
        )
    }
}

function mapStateToProps(state) {
    return {
        decks: state.currentUser.user.decks,
    }
}

export default connect(mapStateToProps)(Content);