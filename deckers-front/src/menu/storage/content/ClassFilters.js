import React, { Component } from 'react';
import styled from "styled-components";

import ClassFilter from './ClassFilter';
import { classImages } from '../../../graphic/card_fliters';
import { CLASS_LIST } from './CardsContent';

const Row = styled.div`
    display: flex;
    justify-content: space-evenly;

    position: absolute;
    bottom: 0;
    left: 0;
    width: 80%;
`

class ClassFilters extends Component {
    render() {
        const { applyClassFilter, pickedClass } = this.props;

        let classFilterList = [];
        for (let [key, img] of classImages) {
            classFilterList.push(<ClassFilter
                img={img}
                applyFilter={() => applyClassFilter(Object.values(CLASS_LIST)[key])}
                key={'_' + Math.random().toString(36).substr(2, 9)}
                isPicked={pickedClass === Object.values(CLASS_LIST)[key] || pickedClass === null}
            />)
        }

        return (
            <Row>
                {classFilterList}
            </Row>
        )
    }
}

export default ClassFilters;

{/* <div className={cL("class-filter", tC(activeClass, this.state.pickedClass == "1"))}
                    onClick={() => {
                        this.pickClass(1)
                        this.handleFilterSelection()
                    }}>
                    <img src='/images/icon_class_mage.png' className="race-filter-icon" />
                </div>
                <div className={cL("class-filter", tC(activeClass, this.state.pickedClass == "2"))}
                    onClick={() => {
                        this.pickClass(2)
                        this.handleFilterSelection()
                    }}>
                </div>
                <div className={cL("class-filter", tC(activeClass, this.state.pickedClass == "3"))}
                    onClick={() => {
                        this.pickClass(3)
                        this.handleFilterSelection()
                    }}>
                    <img src='/images/icon_class_hunter.png' className="race-filter-icon" />
                </div>
                <div className={cL("class-filter", tC(activeClass, this.state.pickedClass == "4"))}
                    onClick={() => {
                        this.pickClass(4)
                        this.handleFilterSelection()
                    }}>
                    <img src='/images/icon_class_priest.png' className="race-filter-icon" />
                </div>
                <div className={cL("class-filter", tC(activeClass, this.state.pickedClass == "5"))}
                    onClick={() => {
                        this.pickClass(5)
                        this.handleFilterSelection()
                    }}>
                    <img src='/images/icon_class_paladin.png' className="race-filter-icon" />
                </div>
                <div className={cL("class-filter", tC(activeClass, this.state.pickedClass == "6"))}
                    onClick={() => {
                        this.pickClass(6)
                        this.handleFilterSelection()
                    }}>
                    <img src='/images/icon_class_merchant.png' className="race-filter-icon" />
                </div>
                <div className={cL("class-filter", tC(activeClass, this.state.pickedClass == "7"))}
                    onClick={() => {
                        this.pickClass(7)
                        this.handleFilterSelection()
                    }}>
                    <img src='/images/icon_class_warlock.png' className="race-filter-icon" />
                </div> */}