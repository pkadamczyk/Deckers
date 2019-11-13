

import React, { Component } from 'react';

import styled from "styled-components";
import background from '../../../graphic/button_short_01.png';
import { device } from '../../../mediaQueries';

const Wrapper = styled.div`
    opacity: ${props => props.isPicked ? "1" : "0.65"};
    display: inline-block;
    background-image: url(${background});
    background-repeat: no-repeat;
    background-size:contain;
    background-position: center;

    margin-left: 1%;

    width: 64px;
    text-align: center;

    @media ${device.laptopL} {
        width: 77px;
    };
    @media ${device.desktopS} {
        width: 88px;
    }
`

const Icon = styled.img`
    width: 56px;
    cursor:pointer;

    @media ${device.laptopL} {
        width: 71px;
    };
    @media ${device.desktopS} {
        width: 80px;
    }
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