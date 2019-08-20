import React, { Component } from 'react';
import styled from "styled-components";
import RaceFilter from './RaceFilter';

import dwarfBackground from '../../graphic/race_filter_02.png';
import skavenBackground from '../../graphic/race_filter_01.png';
import orderBackground from '../../graphic/race_filter_03.png';
import forsakenBackground from '../../graphic/race_filter_04.png';

import dwarfFilter from '../../graphic/icon_race_dwarfs.png';
import skavenFilter from '../../graphic/icon_race_skaven.png';
import orderFilter from '../../graphic/icon_race_order.png';
import forsakenFilter from '../../graphic/icon_race_forsaken.png';
import { RACE_LIST } from './CardsContent';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: auto;
`

class RaceFilters extends Component {
    render() {
        const { applyRaceFilter, pickedRace } = this.props;

        const raceImgsList = [dwarfFilter, forsakenFilter, orderFilter, skavenFilter]
        const raceBackgroundsList = [dwarfBackground, forsakenBackground, orderBackground, skavenBackground]

        const raceFilterList = raceImgsList.map((img, i) => (
            <RaceFilter
                background={raceBackgroundsList[i]}
                img={img}
                applyFilter={() => applyRaceFilter(Object.values(RACE_LIST)[i])}
                key={'_' + Math.random().toString(36).substr(2, 9)}
                isPicked={pickedRace === Object.values(RACE_LIST)[i] || pickedRace === null}
            />
        ))

        return (
            <Wrapper>
                {raceFilterList}
            </Wrapper>
        )
    }
}

export default RaceFilters;