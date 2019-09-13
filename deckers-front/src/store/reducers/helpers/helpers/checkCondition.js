import { Condition } from "../effects";

export function checkCondition(card, condition) {
    const variableValue = getVariableValue(card, condition);
    if (variableValue === null) return false

    if (condition.keyWord === Condition.KEY_WORD.MORE) return variableValue > condition.value;
    if (condition.keyWord === Condition.KEY_WORD.LESS) return variableValue < condition.value;
    if (condition.keyWord === Condition.KEY_WORD.EQUAL) return variableValue === condition.value;
}

function getVariableValue(card, condition) {
    if (condition.variable === Condition.VARIABLE.HEALTH) return card.inGame.stats.health
    if (condition.variable === Condition.VARIABLE.DAMAGE) return card.inGame.stats.damage
    if (condition.variable === Condition.VARIABLE.COST) return card.inGame.stats.cost

    if (condition.variable === Condition.VARIABLE.RACE) return card.race
    if (condition.variable === Condition.VARIABLE.CLASS) return card.role
    return null
}