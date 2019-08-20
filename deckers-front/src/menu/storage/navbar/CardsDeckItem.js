import React, { Component } from 'react';

import styled from "styled-components"
import wrapperBackground from '../../../graphic/button_long_03.png';
import buttonBackground from '../../../graphic/button_X.png';

const Wrapper = styled.div`
    background-image: url(${wrapperBackground});
    background-size: cover;
    background-repeat: no-repeat;
    
    margin:2% auto;
    height:3rem;
    width: 80%;
    
    border-radius: 5px;
    color: white
`

const StyledP = styled.p`
    display: inline-block;
    font-size: 2rem;
    margin-block-end: 0;
    padding: 0;
    width: 80%;
`
const Button = styled.button`
    background-image: url(${buttonBackground});
    background-size: contain;
    background-repeat: no-repeat;
    background-color: transparent;

    display: none;
    position: relative;
    left:0.1rem;
    color:transparent;
    cursor: pointer;
    border: none;

    &:hover{
        display: inline-block;
    }
`

class CardsDeckItem extends Component {
    constructor(props) {
        super(props)

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        const { deckContent, handleClick } = this.props;
        const { cards, name, _id } = deckContent

        handleClick(cards, name, _id)
    }

    render() {
        const { deckContent, handleDeckDeletion } = this.props;
        return (
            <Wrapper>
                <StyledP onClick={this.handleOnClick}>
                    {deckContent && deckContent.name}
                </StyledP>
                <Button
                    onClick={e => handleDeckDeletion(deckContent._id)}
                >
                    X
                </Button>
            </Wrapper>
        )
    }
}
export default CardsDeckItem;