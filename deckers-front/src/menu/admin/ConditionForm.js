import React, { Component } from 'react';

import styled from "styled-components";
import { Condition } from '../../store/reducers/helpers/effects';

class ConditionForm extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        let { index, handleConditionChange, currentValue } = this.props
        if (!(currentValue instanceof Object)) currentValue = { variable: 1, keyWord: 1, value: 0 }
        currentValue = { ...currentValue, [e.target.name]: +e.target.value }

        handleConditionChange(currentValue, index)
    };

    render() {
        let { currentValue } = this.props
        if (!(currentValue instanceof Object)) currentValue = { variable: 1, keyWord: 1, value: 0 }
        const { variable = 1, keyWord = 1, value = 0 } = currentValue


        const variableList = Object.values(Condition.VARIABLE).map((val, i) => <option value={val} key={i + 15}>{Object.keys(Condition.VARIABLE)[i]}</option>)
        const keyWordList = Object.values(Condition.KEY_WORD).map((val, i) => <option value={val} key={i + 15}>{Object.keys(Condition.KEY_WORD)[i]}</option>)
        return (
            <>
                Variable:
                <select name={`variable`} value={variable} onChange={this.handleChange}>
                    {variableList}
                </select>
                Key word:
                <select name={`keyWord`} value={keyWord} onChange={this.handleChange}>
                    {keyWordList}
                </select>
                Value:
                <input name={`value`} type="number" value={value} onChange={this.handleChange} />
            </>
        )
    }
}

export default ConditionForm;