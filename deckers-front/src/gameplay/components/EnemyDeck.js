import React, { Component } from 'react';
import { connect } from "react-redux"
import styled from "styled-components"
import Deck from "./Deck"

const Div = styled.div`
    position: absolute;
    right: 0;
    top: 18%;
`
class EnemyDeck extends Component {
    render() {
        const { enemyDeckCardsAmount } = this.props
        return (
            <Div>
                <Deck >
                    <div>Cards: {enemyDeckCardsAmount}</div>
                </Deck>
            </Div>
        )
    }
}

function mapStateToProps(state) {
    return {
        enemyDeckCardsAmount: state.game.gameInfo.enemyDeckCardsAmount,
    }
}

export default connect(mapStateToProps)(EnemyDeck); 