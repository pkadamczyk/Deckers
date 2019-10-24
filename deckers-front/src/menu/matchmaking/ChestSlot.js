import React, { Component } from 'react';

import styled from "styled-components"

const Wrapper = styled.div`
    width: 45%;
    height: 100%;

    background: #eee;
    border-radius: 10px;
`

const Empty = styled.div`
    color: #ccc;
    font-size: 35px;

    text-align: center;

    -webkit-user-select: none;        
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none;
`

class ChestSlot extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Wrapper>
                <Empty>Empty chest slot</Empty>
            </Wrapper>
        )
    }
}

export default ChestSlot;
