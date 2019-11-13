import React, { Component } from 'react';

import styled from "styled-components"
import wrapperBackground from '../../../graphic/button_long_03.png';
import { device } from '../../../mediaQueries';

const Wrapper = styled.div`
    background-image: url(${wrapperBackground});
    background-size: cover;
    background-repeat: no-repeat;
    
    margin: 3% auto;
    width: 80%;
    
    border-radius: 5px;
    color: white;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;
`

const DeckNumber = styled.div`
    display: inline-block;
    font-size: 30px;

    padding: 0;
    width: 80%;

    @media ${device.laptopL} {
        font-size: 34px;
    };
    @media ${device.desktopS} {
        font-size: 38px;
    }
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
        const { deckContent } = this.props;

        return (
            <Wrapper>
                <DeckNumber onClick={this.handleOnClick}>
                    {deckContent && deckContent.name}
                </DeckNumber>
            </Wrapper>
        )
    }
}
export default DeckItem;