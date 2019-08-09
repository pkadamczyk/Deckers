import React, { Component } from 'react';
import styled from "styled-components"

import { CARD_WIDTH } from '../containers/Board';

const StyledItem = styled.div` 
    margin: 0 11px 0 0;
    width: ${props => CARD_WIDTH + 'px'};
    height: 130px;

    background: grey;

    border: ${props => props.isClicked ? '2px solid rgba(255, 0, 0, 0.7)' : 'none'};
    border-style: ${props => props.isClicked ? 'solid solid none solid' : 'none'};

    -webkit-box-shadow: ${props => props.isClicked ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)" : "none"};
    -moz-box-shadow: ${props => props.isClicked ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)" : "none"};
    box-shadow: ${props => props.isClicked ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)" : "none"};
`;

class NonDraggableCard extends Component {
    constructor(props) {
        super(props);
        this.state = { isClicked: false }

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        const { selected, id, handleSelection, hasPicked } = this.props;

        if (!hasPicked) {
            if (selected === null) {
                this.setState((state) => ({ isClicked: !state.isClicked }))
                handleSelection(id)
            }
            else if (selected === id) {
                this.setState((state) => ({ isClicked: !state.isClicked }))
                handleSelection(null)
            }
        }
    }

    render() {
        const { card } = this.props;
        const { isClicked } = this.state;

        return (
            <StyledItem
                onClick={this.handleOnClick}
                isClicked={isClicked}
            >
                <div>{card.name}</div>
                <div>Hp: {card.stats[card.level].health}</div>
                <div>Dmg: {card.stats[card.level].damage}</div>
                <div>Cost: {card.stats[card.level].cost}</div>
            </StyledItem>
        )
    }
}

export default NonDraggableCard;