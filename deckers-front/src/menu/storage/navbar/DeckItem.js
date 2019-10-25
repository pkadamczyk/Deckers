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
    color: white;
    cursor: pointer;
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

    width: 20px;
    height: 20px;

    cursor: pointer;
    border: none;
`

class DeckItem extends Component {
    constructor(props) {
        super(props)

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        const { deckContent, startDeckEdition } = this.props;
        const { cards, name, _id } = deckContent

        startDeckEdition(cards, name, _id)
    }

    render() {
        const { deckContent, handleDeckDeletion } = this.props;

        return (
            <Wrapper>
                <StyledP onClick={this.handleOnClick}>
                    {deckContent && deckContent.name}
                </StyledP>
                {/* <Button onClick={e => handleDeckDeletion(deckContent._id)} /> */}
            </Wrapper>
        )
    }
}
export default DeckItem;