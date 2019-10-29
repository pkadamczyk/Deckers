import React, { Component } from 'react';
import { connect } from 'react-redux';

import styled from "styled-components";
import { updateShopState } from '../../store/actions/shop';
import { SHOP_STATE } from '../../store/reducers/shop';
import Card from './Card';

const Wrapper = styled.div`
    height: 100%;
    width: 100%;

    position: fixed;
    left:0;
    top:0;
    z-index: 10;

    display: flex;
    align-items: center;
    justify-content: center;

    background:rgba(0, 0, 0, 0.65);
    `

const Text = styled.div`
    color:white;
    font-size: 30px;
    margin:auto
`

const Button = styled.button`
    border:none;
    border-radius: 10px;
    background: #8FC320;

    color:${props => props.disabled ? "red" : "white"};
    font-size: 24px;

    width:45%;
    height: 40px;

    cursor: ${props => !props.disabled ? "pointer" : "inherit"};

    margin: auto;
    transition: all 0.2s;

    :hover{
        background: ${props => !props.disabled ? "9FD430" : "8FC320"};
    };
    :focus { outline: none; }
`

const LootDiv = styled.div`
    height: 60%;
    width: 83%;
    border-radius: 10px;
    padding-top: 2%;

    background: #EDE3DE;

    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
`

const Row = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
`

const Amount = styled.div`
    font-weight: bold;
    font-size: 25px;
`


class Blackout extends Component {
    constructor(props) {
        super(props)

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const { updateShopState } = this.props;
        updateShopState(SHOP_STATE.IDLE, null)
    }

    render() {
        const { lastDrop } = this.props;
        if (!lastDrop) return (
            <Wrapper>
                <Text>Please wait...</Text>
            </Wrapper>
        );

        // {card.amount}x {card.card.name}
        const cardsList = lastDrop.map((card, i) =>
            <Column key={i}>
                <Amount>{card.amount}x</Amount>
                <Card card={card.card} />
            </Column>
        )

        return (
            <Wrapper>
                <LootDiv>
                    <h2>Congratulations!</h2>
                    <Row>{cardsList}</Row>
                    <Button onClick={this.handleClick}>Ok</Button>
                </LootDiv>

            </Wrapper>
        );
    }
}

function mapStateToProps(state) {
    return {
        lastDrop: state.shop.lastDrop,
    };
}

export default connect(mapStateToProps, { updateShopState })(Blackout);