import React, { Component } from 'react';
import CardsContent from './content/CardsContent';
import CardsNavbar from './navbar/CardsNavbar';

import styled from "styled-components";

const Row = styled.div`
    display: flex;
    height: 100%;
`

class Cards extends Component {
    render() {
        return (
            <Row>
                <CardsContent />
                <CardsNavbar />
            </Row>
        )
    }
}

export default Cards;