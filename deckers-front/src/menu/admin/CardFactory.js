import React, { Component } from 'react';

import styled from "styled-components"
import { apiCall } from '../../services/api';
import EffectList from './EffectList';

const Column = styled.div`
    display: flex;
    flex-direction: column;

`

const Row = styled.div`
    display: flex;
`

class CardFactory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rarityList: null,
            raceList: null,
            roleList: null,
            Effect: null,
            cards: null,

            name: "",
            rarity: 0,
            race: 0,
            role: 0,
            description: "",
            stats: [{ cost: 0, health: 0, damage: 0, hasTaunt: false },
            { cost: 0, health: 0, damage: 0, hasTaunt: false },
            { cost: 0, health: 0, damage: 0, hasTaunt: false }],

            cardEffects: {
                onSummon: [],
                finalWords: [],
            },

            isFree: false,
            canBeDropped: true,
        };

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleObjChange = this.handleObjChange.bind(this)
        this.handleEffectChange = this.handleEffectChange.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
    }

    componentWillMount() {
        apiCall("get", `/admin/cards/new`)
            .then(res => {
                const { rarityList, raceList, roleList, Effect, cards } = res

                this.setState({ rarityList, raceList, roleList, Effect, cards })
            }).catch(err => {
                console(err); // indicate the API call failed
            });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { name, rarity, race, role, description, stats, cardEffects, isFree, canBeDropped } = this.state;
        const data = { name, rarity, race, role, description, stats, isFree, canBeDropped, effects: cardEffects }

        return apiCall("post", `/admin/cards`, data)
            .then(res => {
                this.setState({
                    name: "",
                    rarity: 0,
                    race: 0,
                    role: 0,
                    description: "",
                    stats: [
                        { cost: 0, health: 0, damage: 0, hasTaunt: false },
                        { cost: 0, health: 0, damage: 0, hasTaunt: false },
                        { cost: 0, health: 0, damage: 0, hasTaunt: false }],

                    cardEffects: {
                        onSummon: [],
                        finalWords: [],
                    },

                    isFree: false,
                    canBeDropped: true,
                });
            }).catch(err => {
                console.log(err); // indicate the API call failed
            });
    };

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleEffectChange(name, val) {
        let { cardEffects } = this.state;
        cardEffects = { ...cardEffects, [name]: val }

        this.setState({ cardEffects });
    };

    handleCheck(e) {
        this.setState({ [e.target.name]: e.target.checked });
    }

    handleObjChange(e) {
        const { stats } = this.state

        const index = e.target.name.slice(-1);
        const name = e.target.name.slice(0, -1);

        let newStatsObj;
        if (name === "hasTaunt") newStatsObj = { ...stats[index], [name]: e.target.checked }
        else newStatsObj = { ...stats[index], [name]: +e.target.value }

        let newStats = [...stats]
        newStats[+index] = newStatsObj

        this.setState({ stats: newStats });
    };

    render() {
        const { rarityList, raceList, roleList, Effect, cards } = this.state;
        if (rarityList === null) return null

        const rarityOptions = Object.values(rarityList).map((val, i) => <option value={val} key={i}>{Object.keys(rarityList)[i]}</option>)
        const raceOptions = Object.values(raceList).map((val, i) => <option value={val} key={i}>{Object.keys(raceList)[i]}</option>)
        const roleOptions = Object.values(roleList).map((val, i) => <option value={val} key={i}>{Object.keys(roleList)[i]}</option>)

        const { name, rarity, race, role, description, stats, isFree, canBeDropped } = this.state;

        return (
            <Column >
                <form onSubmit={this.handleSubmit}>
                    <Row>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" placeholder="Name" name="name" value={name} onChange={this.handleChange} />
                    </Row>

                    <Row>
                        <label htmlFor="card-rarity">Rarity</label>
                        <select id="card-rarity" name="rarity" value={rarity} onChange={this.handleChange}>
                            {rarityOptions}
                        </select>
                    </Row>

                    <Row >
                        <label htmlFor="card-race">Race</label>
                        <select id="card-race" name="race" value={race} onChange={this.handleChange}>
                            {raceOptions}
                        </select>
                    </Row>

                    <Row >
                        <label htmlFor="card-role">Role</label>
                        <select id="card-role" name="role" value={role} onChange={this.handleChange}>
                            {roleOptions}
                        </select>
                    </Row>

                    <Row>
                        <label htmlFor="description">Description</label>
                        <textarea id="description" rows="3" name="description"
                            placeholder="Description" onChange={this.handleChange} value={description}></textarea>
                    </Row>

                    <table>
                        <thead>
                            <tr>
                                <th >#</th>
                                <th >Cost</th>
                                <th >Damage</th>
                                <th >Health</th>
                                <th >Has Taunt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.map((statsObj, i) => (
                                <tr key={i}>
                                    <td>{i}</td>
                                    <td>
                                        <input type="number" name={`cost${i}`} placeholder='Cost' value={statsObj.cost} onChange={this.handleObjChange} />
                                    </td>
                                    <td>
                                        <input type="number" name={`damage${i}`} placeholder='Damage' value={statsObj.damage} onChange={this.handleObjChange} />
                                    </td>
                                    <td>
                                        <input type="number" name={`health${i}`} placeholder='Health' value={statsObj.health} onChange={this.handleObjChange} />
                                    </td>
                                    <td>
                                        <input type="checkbox" name={`hasTaunt${i}`} checked={statsObj.hasTaunt} onChange={this.handleObjChange} />
                                    </td>
                                </tr>
                            )
                            )}
                        </tbody>
                    </table>

                    <EffectList Effect={Effect} listId="onSummon" handleEffectChange={this.handleEffectChange} cards={cards} />
                    <EffectList Effect={Effect} listId="finalWords" handleEffectChange={this.handleEffectChange} cards={cards} />

                    <Row>
                        <label>
                            <input type="checkbox" checked={isFree} name="isFree" onChange={this.handleCheck} />
                            is free? If true everyone have it
                        </label>
                    </Row>
                    <Row>
                        <label>
                            <input type="checkbox" checked={canBeDropped} name="canBeDropped" onChange={this.handleCheck} />
                            can be dropped? If true theres a chance to drop this card from chest
                        </label>
                    </Row>
                    <button>Submit</button>
                </form>

            </Column>
        )
    }
}

export default CardFactory;