import React, { Component } from 'react';
import styled from "styled-components";
import RaceFilter from './RaceFilter';

import dwarfBackground from '../../../graphic/background_race_dwarfs.png';
import skavenBackground from '../../../graphic/background_race_skaven.png';
import orderBackground from '../../../graphic/background_race_order.png';
import forsakenBackground from '../../../graphic/background_race_forsaken.png';

import { raceImages } from '../../../graphic/card_fliters';
import { RACE_LIST } from './CardsContent';

const Wrapper = styled.div`
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;

    position: absolute;
    left: 0;
    top: 0;
`

class RaceFilters extends Component {
    render() {
        const { applyRaceFilter, pickedRace } = this.props;
        const raceBackgroundsList = [dwarfBackground, forsakenBackground, orderBackground, skavenBackground]

        let raceFilterList = [];
        for (let [key, img] of raceImages) {
            raceFilterList.push(
                <RaceFilter
                    background={raceBackgroundsList[key]}
                    img={img}
                    applyFilter={() => applyRaceFilter(Object.values(RACE_LIST)[key])}
                    key={'_' + Math.random().toString(36).substr(2, 9)}
                    isPicked={pickedRace === Object.values(RACE_LIST)[key] || pickedRace === null}
                />)
        }

        return (
            <Wrapper>
                {raceFilterList}
            </Wrapper>
        )
    }
}

export default RaceFilters;