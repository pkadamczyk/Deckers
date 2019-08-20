

import React, { Component } from 'react';

import styled from "styled-components";
import background from '../../../graphic/button_short_01.png';

const Wrapper = styled.div`
    display: flex;
    height: 100%;

    opacity: ${props => props.isPicked ? "1" : "0.65"};
    display: inline-block;
    background-image: url(${background});
    background-repeat: no-repeat;
    background-size:contain;
    width: 4rem;
    height: 4rem;
    text-align: center;
    margin: 0 0.1rem;
`

const Icon = styled.img`
    width: 3.5rem;
    cursor:pointer;
`

class ClassFilter extends Component {
    constructor(props) {
        super(props);

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        const { applyFilter } = this.props;
        applyFilter()
    }

    render() {
        const { img, isPicked } = this.props;

        return (
            <Wrapper onClick={this.handleOnClick} isPicked={isPicked}>
                <Icon src={img} />
            </Wrapper>
        )
    }
}

export default ClassFilter;