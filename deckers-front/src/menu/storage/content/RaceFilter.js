import React, { Component } from 'react';
import styled from "styled-components";
import { device } from '../../../mediaQueries';

const Wrapper = styled.div`
    background-image: url(${props => props.img});
    background-repeat: no-repeat;
    background-size:contain;
    background-position: center;
    margin-bottom: 15%;

    opacity: ${props => props.isPicked ? "1" : "0.65"};
    text-align: center;
    width: 64px;

    @media ${device.laptopL} {
        width: 77px;
    };
    @media ${device.desktopS} {
        width: 88px;
    }
`

const Icon = styled.img`
    width: 56px;
    cursor: pointer;

    @media ${device.laptopL} {
        width: 71px;
    };
    @media ${device.desktopS} {
        width: 80px;
    }
`

class RaceFilter extends Component {
    constructor(props) {
        super(props);

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        const { applyFilter } = this.props;
        applyFilter()
    }

    render() {
        const { background, img, isPicked } = this.props;

        return (
            <Wrapper
                onClick={this.handleOnClick}
                img={background}
                isPicked={isPicked}
            >
                <Icon src={img} />
            </Wrapper>
        )
    }
}

export default RaceFilter;