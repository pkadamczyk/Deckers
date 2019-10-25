import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardsCardItem from './CardsCardItem';

import styled from "styled-components";
import RaceFilters from './RaceFilters';
import ClassFilters from './ClassFilters';
import { addCardToDeck } from '../../../store/actions/storage';

import leftArrow from '../../../graphic/slider_left.png';
import rightArrow from '../../../graphic/slider_right.png';

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

const CARDS_ON_PAGE = 8

const Wrapper = styled.div`
    height: 100%;
    width: 80%;
`

const Row = styled.div`
    display: flex;
    justify-content: space-evenly; 

    max-width: 900px;
`

const Column = styled.div`
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
`

const CardList = styled.div`
    margin-left: 3%;

    display:flex;
    flex-direction: row;
    justify-content: center;

    width:100%;
    height: 90%;
    padding-top: 1%;
`

const PageTurn = styled.div`
    position: relative;
    z-index: 2;

    width: 7%;
    margin-right: ${props => props.id === 0 ? "3%" : "0"};
    margin-left: ${props => props.id === 1 ? "3%" : "0"};

    transition: 0.3s all;

    background: ${props => `url(${props.img}) no-repeat`};
    background-position: center;
    background-size: contain;
    opacity: 0;

    :hover{
        cursor: ${props => !props.disable ? "pointer" : "inherit"};
        opacity: ${props => !props.disable ? "1" : "0"};
    }
`

class CardsContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            pickedRace: null,
            pickedClass: null,
            allCards: this.props.cards,
        };

        this.handleClassFilter = this.handleClassFilter.bind(this);
        this.handleRaceFilter = this.handleRaceFilter.bind(this);
        this.handleAddCardToDeck = this.handleAddCardToDeck.bind(this);

        this.handleChangePage = this.handleChangePage.bind(this);
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

    handleChangePage(step) {
        const { currentPage } = this.state;
        const { cards } = this.props
        const pageAmount = Math.ceil(cards.length / CARDS_ON_PAGE)

        let newPage = currentPage + step;
        if (newPage < 1) newPage = 1;
        if (newPage > pageAmount) newPage = pageAmount;

        this.setState({ currentPage: newPage })
    }

    render() {
        const { cards, currentState, isDeckFull } = this.props;
        const { pickedRace, pickedClass, currentPage } = this.state;
        const pageAmount = Math.ceil(cards.length / CARDS_ON_PAGE)

        let cardsToDisplay = cards.sort((f, s) => (f.card.stats[f.level - 1].cost - s.card.stats[s.level - 1].cost));

        if (pickedRace !== null) cardsToDisplay = cardsToDisplay.filter(card => card.card.race === pickedRace)
        if (pickedClass !== null) cardsToDisplay = cardsToDisplay.filter(card => card.card.role === pickedClass)

        cardsToDisplay = cardsToDisplay.filter((card, index) => index < (CARDS_ON_PAGE * currentPage) && index >= (CARDS_ON_PAGE * (currentPage - 1))).map(card =>
            <CardsCardItem
                card={card}
                key={card._id}
                currentState={currentState}
                isDeckFull={isDeckFull}
                addCardToDeck={this.handleAddCardToDeck}
            />)

        let arrayFirstHalf = cardsToDisplay.slice(0, Math.ceil(CARDS_ON_PAGE / 2));
        let arraySecondHalf = cardsToDisplay.slice(Math.ceil(CARDS_ON_PAGE / 2), cardsToDisplay.length);

        return (
            <Wrapper>
                <CardList>
                    <PageTurn onClick={() => this.handleChangePage(-1)} disable={currentPage === 1} img={leftArrow} id={0} />
                    <Column>
                        <Row>
                            {arrayFirstHalf}
                        </Row>
                        <Row>
                            {arraySecondHalf}
                        </Row>
                    </Column>
                    <PageTurn onClick={() => this.handleChangePage(1)} disable={currentPage >= pageAmount} img={rightArrow} id={1} />
                </CardList>
                <RaceFilters applyRaceFilter={this.handleRaceFilter} pickedRace={pickedRace} />
                <ClassFilters applyClassFilter={this.handleClassFilter} pickedClass={pickedClass} />
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