import React, { Component } from 'react';
import { connect } from 'react-redux';

import styled from "styled-components";
import { updateShopState } from '../../store/actions/shop';
import { SHOP_STATE } from '../../store/reducers/shop';
import Card from './Card';
import ProgressBar from './ProgressBar';

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
    color: white;

    font-size: 24px;

    width:20%;
    height: 40px;

    cursor: pointer;

    margin: auto;
    transition: all 0.2s;

    :hover{ background: #9FD430; };
    :focus { outline: none; }
`

const LootDiv = styled.div`
    height: 70%;
    width: 83%;
    border-radius: 10px;
    padding-top: 2%;

    background: #EDE3DE;

    opacity: ${props => props.isVisible ? "1" : "0"};
    transition: all 0.5s;

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
        this.state = { isVisible: false, shouldFadeIn: true }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const { updateShopState } = this.props;

        this.setState({ isVisible: false })
        setTimeout(() => updateShopState(SHOP_STATE.IDLE, null), 500)
    }

    render() {
        const { lastDrop, user } = this.props;
        let { isVisible, shouldFadeIn } = this.state;

        if (!lastDrop) return (
            <Wrapper>
                <Text>Please wait...</Text>
            </Wrapper>
        );

        if (shouldFadeIn) setTimeout(() => this.setState({ isVisible: true, shouldFadeIn: false }), 300)

        const cardsList = lastDrop.map((card, i) => {
            const userCardObj = user.cards.find(cardObj => cardObj.card._id === card.card._id);
            return (
                <Column key={i}>
                    <Amount>{card.amount}x</Amount>
                    <Card card={card.card} />
                    <ProgressBar max={100} value={userCardObj.amount} />
                </Column>
            )
        })

        return (
            <Wrapper onClick={this.handleClick}>
                <LootDiv onClick={(e) => e.stopPropagation()} isVisible={isVisible}>
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
        user: state.currentUser.user,
    };
}

export default connect(mapStateToProps, { updateShopState })(Blackout);