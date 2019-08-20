import React, { Component } from 'react';
import CardsContent from './CardsContent';
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
                <div className="col-3">
                    <CardsNavbar />
                </div>
            </Row>
        )
    }
}

export default Cards;