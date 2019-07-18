import React, { Component } from 'react';
import styled from "styled-components"

import { connect } from "react-redux"
import { drawCard } from "../../store/actions/game"
import { CARD_DRAW_COST } from '../../store/reducers/game';

const StyledDiv = styled.div`
    height: 150px;
    width: 80px;

    position: absolute;
    right: 0;

    background: black;
`;

const StyledButton = styled.button`
    width: 100%
`;

class Deck extends Component {
    render() {
        let style;
        if (this.props.player) style = { bottom: '35%' }
        else style = { top: '18%' }

        const isAffortable = this.props.gold >= CARD_DRAW_COST;
        const isDisabled = !isAffortable || !this.props.isMyTurn;

        return (
            <StyledDiv style={style}>
                {this.props.player && <StyledButton onClick={() => this.props.dispatch(drawCard())} disabled={isDisabled}>Buy card</StyledButton>}
            </StyledDiv>
        )
    }
}

function mapStateToProps(state) {
    return {
        isMyTurn: state.game.isMyTurn
    }
}

export default connect(mapStateToProps)(Deck); 