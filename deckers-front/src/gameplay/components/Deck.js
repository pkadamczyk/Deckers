import React, { Component } from 'react';
import styled from "styled-components"

import { connect } from "react-redux"
import { drawCard } from "../../store/actions/game"

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


        return (
            <StyledDiv style={style}>
                {this.props.player && <StyledButton onClick={() => this.props.dispatch(drawCard())}>Buy card</StyledButton>}
            </StyledDiv>
        )
    }
}

export default connect()(Deck); 