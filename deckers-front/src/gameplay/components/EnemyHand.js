import React, { Component } from 'react';

import styled from "styled-components";
import { connect } from "react-redux"
import { CARD_WIDTH } from '../containers/Board';


const StyledDiv = styled.div`
    height: 18%;
    width: 650px;

    position: absolute;
    left: 0;
    top: 0;

    background: DodgerBlue;
    display: flex;
    padding: 8px;
`;

const Card = styled.div` 
    margin: -30px 8px 0 0;
    width: ${props => CARD_WIDTH + 'px'};
    height: 130px;

    background: black;
`;

class EnemyHand extends Component {
    constructor(props) {
        super(props);
        const uniqueId = '_' + Math.random().toString(36).substr(2, 9);
        this.state = { uniqueId }
    }

    render() {
        const { cards } = this.props;
        const { uniqueId } = this.state;

        return (
            <StyledDiv>
                {cards.map((card) => (
                    <Card
                        key={uniqueId}
                    ></Card>
                ))}
            </StyledDiv>
        )
    }
}

function mapStateToProps(state) {
    return {
        cards: state.game.enemyCardsOnHand,
    }
}

export default connect(mapStateToProps)(EnemyHand);