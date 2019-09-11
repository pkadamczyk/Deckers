import React, { Component } from 'react';

import styled from "styled-components";
import { SPELL_ROLE } from '../../gameplay/containers/Game';

const Column = styled.div`
    display: flex;
    flex-direction: column;

`

const Row = styled.div`
    display: flex;
`

class EffectList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            list: [{ target: 0, effect: 0, value: 0 }],
        }

        this.changeRowAmount = this.changeRowAmount.bind(this)
        this.handleValueChange = this.handleValueChange.bind(this)
    }

    changeRowAmount(val) {
        const { list } = this.state;

        let newEffectList = [...list]
        val > 0 ? newEffectList.push({ target: 0, effect: 0, value: 0 }) : newEffectList.pop()

        this.setState({ list: newEffectList })
    };

    handleValueChange(e) {
        const { list } = this.state;
        const { handleEffectChange, listId, Effect } = this.props;

        const index = e.target.name.slice(-1);
        const name = e.target.name.slice(0, -1);

        let newEffect
        if (list[index].effect === Effect.EFFECT_LIST.SUMMON && name === "value") newEffect = { ...list[index], [name]: e.target.value }
        else newEffect = { ...list[index], [name]: +e.target.value }

        let newEffectList = [...list]
        newEffectList[+index] = newEffect

        this.setState({ list: newEffectList });
        handleEffectChange(listId, newEffectList);
    };

    render() {
        const { list } = this.state;
        const { listId, Effect, cards } = this.props;

        // const otherTargetList = Object.values(Effect.TARGET_LIST)
        //     .filter(target => !(target instanceof Object))
        //     .map((val, i) => <option value={val} key={i}>{Object.keys(Effect.TARGET_LIST)[i]}</option>)

        const singleTargetList = Object.values(Effect.TARGET_LIST.SINGLE_TARGET).map((val, i) => <option value={val} key={i + 15}>{Object.keys(Effect.TARGET_LIST.SINGLE_TARGET)[i]}</option>)
        const aoeTargetList = Object.values(Effect.TARGET_LIST.AOE).map((val, i) => <option value={val} key={i + 15}>{Object.keys(Effect.TARGET_LIST.AOE)[i]}</option>)
        const generalTargetList = Object.values(Effect.TARGET_LIST.GENERAL).map((val, i) => <option value={val} key={i + 15}>{Object.keys(Effect.TARGET_LIST.GENERAL)[i]}</option>)

        const effectList = Object.values(Effect.EFFECT_LIST).map((val, i) => <option value={val} key={i}>{Object.keys(Effect.EFFECT_LIST)[i]}</option>)

        const cardList = cards.filter(card => card.role !== SPELL_ROLE).map((card, i) => (
            <option value={card._id} key={i}>{card.name}</option>
        ))

        const htmlList = list.map((el, i) => {
            const aoeTargetAvailable = el.effect !== Effect.EFFECT_LIST.SUMMON
            const singleTargetAvailable = el.effect !== Effect.EFFECT_LIST.SUMMON
            const generalTargetAvailable = el.effect === Effect.EFFECT_LIST.SUMMON

            return (
                <Row key={i + Math.random()}>
                    Effect:
                    <select name={`effect${i}`} value={el.effect} onChange={this.handleValueChange}>
                        {effectList}
                    </select>
                    Target:
                    <select name={`target${i}`} value={el.target} onChange={this.handleValueChange}>
                        {aoeTargetAvailable && <optgroup label="AOE">
                            {aoeTargetList}
                        </optgroup>}
                        {singleTargetAvailable && <optgroup label="Single Target">
                            {singleTargetList}
                        </optgroup>}
                        {generalTargetAvailable && <optgroup label="General">
                            {generalTargetList}
                        </optgroup>}
                    </select>
                    Value:
                    {el.effect !== Effect.EFFECT_LIST.SUMMON && <input name={`value${i}`} type="number" value={el.value} onChange={this.handleValueChange} />}
                    {el.effect === Effect.EFFECT_LIST.SUMMON && <select name={`value${i}`} value={el.value} onChange={this.handleValueChange}>
                        {cardList}
                    </select>}
                </Row>
            )
        })

        return (
            <Column>
                <div>{listId} effects</div>
                {htmlList}
                <Row><button onClick={() => this.changeRowAmount(1)}>More</button> <button onClick={() => this.changeRowAmount(-1)}> Less</button></Row>
            </Column >
        )
    }
}

export default EffectList;