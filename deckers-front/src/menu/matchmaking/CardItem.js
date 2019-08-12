import React, { Component } from 'react';
import styled from "styled-components"
import titleImg from '../../graphic/title_03.png'

const CardRect = styled.div`
    background-image: url(${titleImg});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin:0px 10px;
    margin-top: 5px;
    widows: 100%;
    height:45px;
    border-radius: 5px;
    color: white;
`

const Name = styled.div`
padding-top:10px;  
`

class CardItem extends Component {
    render() {
        const { deckSlot } = this.props;

        return (
            <CardRect>
                <Name><p>{deckSlot.name}</p></Name>
            </CardRect>
        )
    }
}

export default CardItem;