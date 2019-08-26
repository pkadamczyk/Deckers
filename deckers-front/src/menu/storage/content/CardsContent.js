import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardsCardItem from './CardsCardItem';

import styled from "styled-components";
import wrapperBackground from '../../../graphic/background_book_01.png'
import RaceFilters from './RaceFilters';
import ClassFilters from './ClassFilters';
import { addCardToDeck } from '../../../store/actions/storage';

export const RACE_LIST = {
    DWARF: 0,
    FORSAKEN: 1,
    ORDER: 2,
    SKAVEN: 3,
};

export const CLASS_LIST = {
    WARRIOR: 0,
    HUNTER: 1,
    ASSASSIN: 2,
    MAGE: 3,
    KNIGHT: 4,
    PRIEST: 5,
    WARLOCK: 6,
    MERCHANT: 7,
    SPELL: 8
};

const Wrapper = styled.div`
    background-image: url(${wrapperBackground});
    background-repeat: no-repeat;
    background-size:contain;
    
    height: 100%;
    width: 80%;

    display: flex;
`

const Column = styled.div`
    display: flex;
    width:100%;
    flex-direction: column;
    justify-content: center;
`

const Row = styled.div`
    display: flex;
    height: 100%;
`

const CardList = styled.div`
    display:flex;
    flex-wrap: wrap;
    justify-content: space-around;

    height: 80%;
    width:100%;
    padding-left:2%;
    padding-top:2.5rem;
`

class CardsContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickedRace: null,
            pickedClass: null,
            allCards: this.props.cards,
        };

        this.handleClassFilter = this.handleClassFilter.bind(this);
        this.handleRaceFilter = this.handleRaceFilter.bind(this);
        this.handleAddCardToDeck = this.handleAddCardToDeck.bind(this);
    }


    handleClassFilter = (pickedClass) => {
        if (pickedClass === this.state.pickedClass) return this.setState({ pickedClass: null })
        this.setState({ pickedClass })
    }

    handleRaceFilter = (pickedRace) => {
        if (pickedRace === this.state.pickedRace) return this.setState({ pickedRace: null })
        this.setState({ pickedRace })
    }

    handleAddCardToDeck(card) {
        this.props.dispatch(addCardToDeck(card))
    }

    render() {
        const { cards, currentState, isDeckFull } = this.props;
        const { pickedRace, pickedClass } = this.state;

        let cardsToDisplay = cards.sort((f, s) => (f.card.stats[f.level - 1].cost - s.card.stats[s.level - 1].cost));

        if (pickedRace !== null) cardsToDisplay = cardsToDisplay.filter(card => card.card.race === pickedRace)
        if (pickedClass !== null) cardsToDisplay = cardsToDisplay.filter(card => card.card.role === pickedClass)

        cardsToDisplay = cardsToDisplay.filter((card, index) => index <= 7).map(card =>
            <CardsCardItem
                card={card}
                key={card._id}
                currentState={currentState}
                isDeckFull={isDeckFull}
                addCardToDeck={this.handleAddCardToDeck}
            />)

        return (
            <Wrapper>
                <Column>
                    <Row>
                        <CardList>
                            {cardsToDisplay}
                        </CardList>

                        <RaceFilters applyRaceFilter={this.handleRaceFilter} pickedRace={pickedRace} />
                    </Row>
                    <ClassFilters applyClassFilter={this.handleClassFilter} pickedClass={pickedClass} />
                </Column>
            </Wrapper>
        )
    }
}

function mapStateToProps(state) {
    return {
        cards: state.currentUser.user.cards,
        currentState: state.storage.currentState,
        isDeckFull: state.storage.isFull
    }
}

export default connect(mapStateToProps)(CardsContent);