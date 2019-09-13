const CardModel = require("../../../models/card");

class Effect {
    static checkCondition(card, condition) {
        const variableValue = this.getVariableValue(card, condition);
        if (variableValue === null) return false

        if (condition.keyWord === CardModel.Condition.KEY_WORD.MORE) return variableValue > condition.value;
        if (condition.keyWord === CardModel.Condition.KEY_WORD.LESS) return variableValue < condition.value;
        if (condition.keyWord === CardModel.Condition.KEY_WORD.EQUAL) return variableValue === condition.value;
    }

    static getVariableValue(card, condition) {
        if (condition.variable === CardModel.Condition.VARIABLE.HEALTH) return card.inGame.stats.health
        if (condition.variable === CardModel.Condition.VARIABLE.DAMAGE) return card.inGame.stats.damage
        if (condition.variable === CardModel.Condition.VARIABLE.COST) return card.inGame.stats.cost

        if (condition.variable === CardModel.Condition.VARIABLE.RACE) return card.race
        if (condition.variable === CardModel.Condition.VARIABLE.CLASS) return card.role
        return null
    }
}

module.exports = Effect