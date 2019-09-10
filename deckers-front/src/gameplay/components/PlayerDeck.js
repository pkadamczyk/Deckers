import React, { Component } from 'react';

import Deck from "./Deck"
import { connect } from 'react-redux';
import styled from "styled-components"
import { drawCard, setGameState } from "../../store/actions/game"
import { CARD_DRAW_COST, GAME_STATE, MAX_CARDS_ON_HAND } from '../../store/reducers/game';

const StyledButton = styled.button`
    width: 100%;

    position:absolute;
    z-index: 1;
`;

const Div = styled.div`
    position: absolute;
    right: 0;
    bottom: 35%;

    color: white;
`
class PlayerDeck extends Component {
    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this)
    }

    handleOnClick() {
        this.props.dispatch(setGameState(GAME_STATE.BUSY));
        this.props.dispatch(drawCard());
    }

    render() {
        const { gold, isMyTurn, gameState, cardsLeft, cardsOnHand } = this.props;
        const isAffortable = gold >= CARD_DRAW_COST;
        const hasCards = cardsLeft > 0
        const isHandFull = cardsOnHand.length >= MAX_CARDS_ON_HAND

        const isButtonDisabled = !isAffortable || !isMyTurn || gameState !== GAME_STATE.IDLE || !hasCards || isHandFull;
        return (
            <Div>
                <Deck>
                    <StyledButton
                        onClick={() => this.handleOnClick()}
                        disabled={isButtonDisabled}
                    >
                        Buy card
                    </StyledButton>
                    <div>Cards: {cardsLeft}</div>
                </Deck>
            </Div>
        )
    }
}

function mapStateToProps(state) {
    return {
        cardsOnHand: state.game.cardsOnHand,
        cardsLeft: state.game.deckCardsAmount,
        gold: state.game.playerHeroGold,
        isMyTurn: state.game.isMyTurn,
        gameState: state.game.gameState,
    }
}

export default connect(mapStateToProps)(PlayerDeck); 