import React, { Component } from 'react';

import styled from "styled-components"
import { connect } from "react-redux"
import NonDraggableCard from '../components/NonDraggableCard';

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
    margin: auto;

    display: flex;
    align-items: center;
    justify-content: center;

    background: rgba(0,0,0,0.7);
    z-index: 10;
    position:absolute;
`;

const Button = styled.button`
    height:50px;
    width:120px;

    background-color: #749a02;
    border-color:#749a02;

    border-radius: 6px;
    color: white;
    -webkit-box-shadow:  0px 0px 18px 0px rgba(145,189,9,1);
    -moz-box-shadow:  0px 0px 18px 0px rgba(145,189,9,1);
    box-shadow: 0px 0px 18px 0px rgba(145,189,9,1);

    &:hover {
        background-color: #85ab13;
        border-color: #85ab13;
    }
`;

class Starter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: null,
        }

        this.handleSelection = this.handleSelection.bind(this);
    }

    handleSelection(id) {
        this.setState({ selected: id })
    }

    render() {
        const { selected } = this.state;

        return (
            <Wrapper>
                <NonDraggableCard handleSelection={this.handleSelection} id={0} selected={selected} />
                <NonDraggableCard handleSelection={this.handleSelection} id={1} selected={selected} />
                <NonDraggableCard handleSelection={this.handleSelection} id={2} selected={selected} />
                <Button>
                    Ready
                </Button>
            </Wrapper>
        )
    }
}

function mapStateToProps(state) {
    return {
    }
}

export default connect(mapStateToProps)(Starter);