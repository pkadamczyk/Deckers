import React, { Component } from 'react';

import styled from "styled-components"
import { connect } from "react-redux"
import NonDraggableCard from '../components/NonDraggableCard';
import { pickStarterCards } from '../../store/actions/game';

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
    margin: auto;

    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    background: rgba(0,0,0,0.7);
    z-index: 10;
    position:absolute;
`;

const Row = styled.div`
    display: flex;
    margin: 20px;
`;

const Text = styled.div`
    color: #f8f8ff;
    font-size: 24px;
`;

const BottomText = styled(Text)`
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
        const { cards } = this.props;

        const isReady = !!cards;

        let primaryCards = null;
        if (isReady) primaryCards = cards.slice(0, 3);
        // const [replacementCard] = cards.slice(-1)

        if (!isReady) return <Wrapper><Text>Loading...</Text></Wrapper>;

        return (
            <Wrapper>
                <Text>{text}</Text>
                <Row>
                    {primaryCards.map((card, index) => (
                        <NonDraggableCard
                            key={card._id + index}
                            card={card}
                            handleSelection={this.handleSelection}
                            id={index}
                            selected={selected}
                            hasPicked={hasPicked}
                        ></NonDraggableCard>
                    ))}
                </Row>
                {hasPicked ?
                    <BottomText>Enemy is still choosing...</BottomText> :
                    <Button onClick={this.handleOnClick}>
                        Ready
                    </Button>
                }
            </Wrapper>
        )
    }
}

function mapStateToProps(state) {
    return {
        role: state.game.gameInfo.role,
        cards: state.game.gameInfo.starterCards,
    }
}

export default connect(mapStateToProps)(Starter);