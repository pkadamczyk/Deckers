import React, { Component } from 'react';
import styled from "styled-components"

import { CARD_WIDTH } from '../containers/Board';

const StyledItem = styled.div` 
    margin: 0 8px 0 0;
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
        if (this.props.selected === null) {
            this.setState((state, props) => {
                return {
                    isClicked: !state.isClicked,
                };
            })
            this.props.handleSelection(this.props.id)
        }
        else if (this.props.selected === this.props.id) {
            this.setState((state, props) => {
                return {
                    isClicked: !state.isClicked,
                };
            })
            this.props.handleSelection(null)
        }

    }

    render() {
        return (
            <StyledItem
                onClick={this.handleOnClick}
                isClicked={this.state.isClicked}
            >
                <div>aaa</div>
                <div>Hp: 1</div>
                <div>Dmg: 2</div>
                <div>Cost: 3</div>
            </StyledItem>
        )
    }
}

export default NonDraggableCard;