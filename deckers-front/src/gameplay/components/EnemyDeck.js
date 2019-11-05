import React, { Component } from 'react';
import { connect } from "react-redux"
import styled from "styled-components"
import Deck from "./Deck"

const Wrapper = styled.div`
    position: absolute;
    right: 0;
    top: 24%;

    color: white;
`

const CardAmount = styled.div`
    margin: auto;
`
class EnemyDeck extends Component {
    render() {
        const { enemyDeckCardsAmount } = this.props
        return (
            <Wrapper>
                <Deck >
                    <CardAmount>Cards: {enemyDeckCardsAmount}</CardAmount>
                </Deck>
            </Wrapper>
        )
    }
}

function mapStateToProps(state) {
    return {
        enemyDeckCardsAmount: state.game.enemyDeckCardsAmount,
    }
}

export default connect(mapStateToProps)(EnemyDeck); 