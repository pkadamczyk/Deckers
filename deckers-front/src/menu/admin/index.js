import React, { Component } from 'react';

import styled from "styled-components"
import CardFactory from './CardFactory';

const Row = styled.div`
    display: flex;
    height: 100%;
`

class AdminPanel extends Component {
    render() {
        return (
            <Row >
                <CardFactory />
            </Row>
        )
    }
}

export default AdminPanel;