import React, { Component } from 'react';

import Deck from "./Deck"
import { connect } from 'react-redux';
import styled from "styled-components"
import { drawCard, setGameState } from "../../store/actions/game"
import { CARD_DRAW_COST, GAME_STATE, MAX_CARDS_ON_HAND } from '../../store/reducers/game';

const StyledButton = styled.button`
    width: 100%;

    transition: 0.2s ease;
    height:50px;
    width: 100%;

    background-color: ${props => !props.disabled ? "#749a02" : "#bbbbbb"};
    border-color: ${props => !props.disabled ? "#749a02" : "#bbbbbb"};

    color: white;

    :hover {
        background-color: ${props => !props.disabled ? "#85ab13" : "#bbbbbb"};
        border-color: ${props => !props.disabled ? "#85ab13" : "#bbbbbb"};
    };
    :focus { outline: none; };

    position: relative;
    z-index: 1;
`;

const Wrapper = styled.div`
    position: absolute;
    right: 0;
    bottom: 42%;

    color: white;
`
const CardAmount = styled.div`
    margin: auto;
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
            <Wrapper>
                <Deck>
                    <StyledButton
                        onClick={() => this.handleOnClick()}
                        disabled={isButtonDisabled}
                    >
                        Buy card
                    </StyledButton>
                    <CardAmount>Cards: {cardsLeft}</CardAmount>
                </Deck>
            </Wrapper>
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