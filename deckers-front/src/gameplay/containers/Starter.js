import React, { Component } from 'react';

import styled, { keyframes } from "styled-components"
import { connect } from "react-redux"
import NonDraggableCard from '../components/NonDraggableCard';
import { pickStarterCards } from '../../store/actions/game';
import { delayUnmounting } from '../../hocs/delayedComponent';

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const Blackout = styled.div`
    height: 100%;
    width: 100%;
    margin: auto;

    opacity: ${props => !props.gameReady ? "1" : "0"};
    transition: all 0.5s;

    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    background: rgba(0,0,0,0.7);
    z-index: 10;
    position:absolute;
`;

const ContentWrap = styled.div`
    height: 60%;
    width: 60%;
    border-radius: 10px;
    padding-top: 2%;

    background: #EDE3DE;

    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;

    animation: ${fadeIn} 0.5s linear;
`

const Row = styled.div`
    display: flex;
`;

const Text = styled.div`
    color: #f8f8ff;
    font-size: 24px;
`;

const BottomText = styled.div`
    font-size: 24px;
    margin-top:24px;
`

const Button = styled.button`
    height:50px;
    width:120px;
    margin-top: 10px;

    background-color: #749a02;
    border-color:#749a02;

    border-radius: 6px;
    color: white;
    -webkit-box-shadow:  0px 0px 18px 0px rgba(145,189,9,1);
    -moz-box-shadow:  0px 0px 18px 0px rgba(145,189,9,1);
    box-shadow: 0px 0px 18px 0px rgba(145,189,9,1);

    :hover {
        background-color: #85ab13;
        border-color: #85ab13;
    };
    :focus { outline: none; }
`;

const DelayedBlackout = delayUnmounting(Blackout)
class Starter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: null,
            text: "You can pick one card to be replaced",
            hasPicked: false,
        }

        this.handleSelection = this.handleSelection.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleSelection(id) {
        this.setState({ selected: id })
    }

    handleOnClick() {
        const { role } = this.props;
        const { selected } = this.state;

        this.setState({ text: "Please wait", hasPicked: true })
        this.props.dispatch(pickStarterCards(selected, role))
    }

    render() {
        const { selected, text, hasPicked } = this.state;
        const { cards, gameReady } = this.props;
        const isReady = !!cards;

        if (!isReady) return <Blackout><Text>Loading...</Text></Blackout>;
        const primaryCards = cards.slice(0, 3);

        return (
            <DelayedBlackout gameReady={gameReady} isMounted={!gameReady} delayTime={500}>
                <ContentWrap>
                    <h2>{text}</h2>
                    <Row>
                        {primaryCards.map((card, index) => (
                            <NonDraggableCard
                                key={card._id + index}
                                card={card}
                                handleSelection={this.handleSelection}
                                id={index}
                                selected={selected}
                                hasPicked={hasPicked}
                                size={150}
                            />
                        ))}
                    </Row>
                    {hasPicked ?
                        <BottomText>Enemy is still choosing...</BottomText> :
                        <Button onClick={this.handleOnClick}>
                            Ready
                    </Button>
                    }
                </ContentWrap>
            </DelayedBlackout>
        )
    }
}

function mapStateToProps(state) {
    return {
        role: state.game.gameInfo.role,
        cards: state.game.gameInfo.starterCards,
        gameReady: !!state.game.currentRound,
    }
}

export default connect(mapStateToProps)(Starter);