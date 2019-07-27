import React, { Component } from 'react';

import Deck from "./Deck"
import { connect } from 'react-redux';
import styled from "styled-components"
import { drawCard } from "../../store/actions/game"
import { CARD_DRAW_COST } from '../../store/reducers/game';

const StyledButton = styled.button`
    width: 100%
`;

const Div = styled.div`
position: absolute;
    right: 0;
bottom: 35%;
`
class PlayerDeck extends Component {
    render() {
        const { gold, isMyTurn } = this.props;
        const isAffortable = gold >= CARD_DRAW_COST;
        const isButtonDisabled = !isAffortable || !isMyTurn;

        return (
            <Div>
                <Deck>
                    <StyledButton
                        onClick={() => this.props.dispatch(drawCard())}
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
    }
}

export default connect(mapStateToProps)(PlayerDeck); 