import React, { Component } from 'react';
import styled from "styled-components";

const Wrapper = styled.div`
    background-image: url(${props => props.img});
    background-repeat: no-repeat;
    background-size:contain;

    opacity: ${props => props.isPicked ? "1" : "0.65"};
    width: 4rem;
    height: 4rem;
    text-align: center;
    padding-top: 0.2rem;
    margin-bottom: 1rem;
`

const Icon = styled.img`
    width: 3.5rem;
    cursor: pointer;
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