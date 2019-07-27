import React, { Component } from 'react';

import Deck from "./Deck"
import { connect } from 'react-redux';
import styled from "styled-components"
import { drawCard, setGameState } from "../../store/actions/game"
import { CARD_DRAW_COST, GAME_STATE } from '../../store/reducers/game';

const StyledButton = styled.button`
    width: 100%
`;

const Div = styled.div`
    position: absolute;
    right: 0;
    bottom: 35%;
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
        const { gold, isMyTurn, gameState } = this.props;
        const isAffortable = gold >= CARD_DRAW_COST;
        const isButtonDisabled = !isAffortable || !isMyTurn || gameState !== GAME_STATE.IDLE;

        return (
            <Div>
                <Deck>
                    <StyledButton
                        onClick={() => this.handleOnClick}
                        disabled={isButtonDisabled}
                    >
                        Buy card
                    </StyledButton>
                </Deck>
            </Div>
        )
    }
}

function mapStateToProps(state) {
    return {
        gold: state.game.playerHeroGold,
        isMyTurn: state.game.isMyTurn,
        gameState: state.game.gameState,
    }
}

export default connect(mapStateToProps)(PlayerDeck); 