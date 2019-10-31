import React, { Component } from 'react';
import styled from "styled-components"

import { CARD_WIDTH } from '../containers/Board';
import Card from '../Card';

const StyledItem = styled.div` 
    margin: 0 11px 0 0;
    width: ${props => props.size + 'px'};
    height:${props => (props.size * 1.4) + "px"};
    max-height: 242px;

    background: grey;

    border: ${props => props.isClicked ? '2px solid rgba(255, 0, 0, 0.7)' : 'none'};
    border-style: ${props => props.isClicked ? 'solid solid none solid' : 'none'};

    -webkit-box-shadow: ${props => props.isClicked ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)" : "none"};
    -moz-box-shadow: ${props => props.isClicked ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)" : "none"};
    box-shadow: ${props => props.isClicked ? "0px -1px 2px 3px rgba(255, 0, 0,0.7)" : "none"};

    cursor: pointer;
`;

class NonDraggableCard extends Component {
    constructor(props) {
        super(props);

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        const { selected, id, handleSelection, hasPicked } = this.props;

        if (!hasPicked) {
            if (selected === id) {
                return handleSelection(null)
            }

            handleSelection(id)
        }
    }

    render() {
        const { card, selected, id, size } = this.props;

        const isClicked = selected === id
        return (
            <StyledItem
                onClick={this.handleOnClick}
                isClicked={isClicked}
                size={size || CARD_WIDTH}
            >
                <Card card={card} size={size} />
            </StyledItem>
        )
    }
}

export default NonDraggableCard;