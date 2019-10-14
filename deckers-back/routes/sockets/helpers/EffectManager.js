const CardModel = require("../../../models/card");
const config = require("./gameConfig")

// Used in translating some of frontend data
const CONST = {
    GENERAL_ENEMY_INDICATOR: "enemy",
    GENERAL_HERO_INDICATOR: "portrait",
    GENERAL_MINION_INDICATOR: "minion"
}

class Effect {
    constructor(gameRef) {
        this.gameRef = gameRef

        CardModel.find({}).then(res => this.cardList = res)
    }

    invokeCardEffect(effect, target, reversePlayers = false) {
        if (Object.values(CardModel.Effect.TARGET_LIST.AOE).includes(effect.target)) this.applyEffectAoe(effect)
        else if (target !== null) this.applyEffectToTarget(target, effect)
        else if (effect.effect === CardModel.Effect.EFFECT_LIST.SUMMON)
            this.handleSummonEffect(effect, reversePlayers)
    }

    handleSummonEffect(effect, reversePlayers) {
        const TARGET_LIST = CardModel.Effect.TARGET_LIST // Its just shorter

        const includeEnemyBoard = [TARGET_LIST.GENERAL.ALL, TARGET_LIST.GENERAL.ENEMY]
        const includeAllyBoard = [TARGET_LIST.GENERAL.ALL, TARGET_LIST.GENERAL.ALLY]

        const card = this.cardList.find(dbCard => dbCard._id.equals(effect.value)).toObject();

        const gameCard = {
            ...card,
            inGame: {
                isReady: false,
                stats: card.stats[config.SUMMONED_CARD_LEVEL - 1] // stats are array, starts at 0, levels starts at 1
            },
            level: config.SUMMONED_CARD_LEVEL
        }

        const currentPlayer = reversePlayers ? +!this.gameRef.currentPlayer : this.gameRef.currentPlayer

        // Makes sure you dont have too many cards on board
        const isEnemyBoardFull = this.gameRef.players[+!currentPlayer].cardsOnBoard.length >= config.MAX_CARDS_ON_BOARD
        const isAllyBoardFull = this.gameRef.players[currentPlayer].cardsOnBoard.length >= config.MAX_CARDS_ON_BOARD

        if (includeEnemyBoard.includes(effect.target) && !isEnemyBoardFull) this.gameRef.players[currentPlayer].cardsOnBoard.push(gameCard)
        if (includeAllyBoard.includes(effect.target) && !isAllyBoardFull) this.gameRef.players[currentPlayer].cardsOnBoard.push(gameCard)
    }

    applyEffectToTarget(target, effect) {
        const EFFECT_LIST = CardModel.Effect.EFFECT_LIST // Just shorter
        if (effect.effect === EFFECT_LIST.DAMAGE) effect.value = -Math.abs(effect.value);

        const reversePlayers = target.includes(CONST.GENERAL_ENEMY_INDICATOR)
        const affectedPlayer = reversePlayers ? +!this.gameRef.currentPlayer : this.gameRef.currentPlayer

        if (target.includes(CONST.GENERAL_HERO_INDICATOR)) {
            this.gameRef.players[affectedPlayer].health += effect.value

            // Handles overheal
            if (this.gameRef.players[affectedPlayer].health > config.MAX_HERO_HEALTH)
                this.gameRef.players[affectedPlayer].health = config.MAX_HERO_HEALTH

            // Hero death means gameover, which is handled by socket logics
        }
        else if (target.includes(CONST.GENERAL_MINION_INDICATOR)) {
            const minionIndex = +target.slice(-1);
            const card = this.gameRef.players[affectedPlayer].cardsOnBoard[minionIndex]

            if (effect.effect === EFFECT_LIST.KILL_ON_CONDITION) {
                const isConditionMeet = this.checkCondition(card, effect.value)

                // Marks minion as dead and filters it out, needs to be done before final words
                if (isConditionMeet) this.gameRef.players[affectedPlayer].cardsOnBoard[minionIndex] = null
            }
            else if (effect.effect === EFFECT_LIST.SWAP_STATS) {
                const temp = card.inGame.stats.health;
                card.inGame.stats.health = card.inGame.stats.damage
                card.inGame.stats.damage = temp

                if (card.inGame.stats.health <= 0) this.gameRef.players[affectedPlayer].cardsOnBoard[minionIndex] = null
            }
            else {
                card.inGame.stats.health += effect.value

                // Handles overheal
                if (card.inGame.stats.health > card.stats[card.level - 1].health)
                    card.inGame.stats.health = card.stats[card.level - 1].health

                // Place a null value in minion array if he died
                if (card.inGame.stats.health <= 0) this.gameRef.players[affectedPlayer].cardsOnBoard[minionIndex] = null
            }

            //  Filters out dead minions, needs to be done before final words
            this.gameRef.players[affectedPlayer].cardsOnBoard = this.gameRef.players[affectedPlayer].cardsOnBoard.filter(card => card !== null)

            const didMinionDie = this.gameRef.players[affectedPlayer].cardsOnBoard[minionIndex] === null
            const hasEffects = card.effects && card.effects.finalWords && card.effects.finalWords.length > 0
            if (hasEffects && didMinionDie) this.invokeCardEffect(card.effects.finalWords[0], null, reversePlayers)
        }
    }

    applyEffectAoe(effect) {
        const { TARGET_LIST, EFFECT_LIST } = CardModel.Effect
        let helper = 0

        const includeEnemyBoard = [TARGET_LIST.AOE.ALL, TARGET_LIST.AOE.ENEMY, TARGET_LIST.AOE.ALL_MINIONS, TARGET_LIST.AOE.ENEMY_MINIONS]
        const includeAllyBoard = [TARGET_LIST.AOE.ALL, TARGET_LIST.AOE.ALLY, TARGET_LIST.AOE.ALL_MINIONS, TARGET_LIST.AOE.ALLY_MINIONS]

        const includeEnemyHero = [TARGET_LIST.AOE.ALL, TARGET_LIST.AOE.ENEMY]
        const includeAllyHero = [TARGET_LIST.AOE.ALL, TARGET_LIST.AOE.ALLY]

        // Determines whose board should be affected
        let affectedPlayers = [];
        if (includeEnemyBoard.includes(effect.target)) affectedPlayers.push(+!this.gameRef.currentPlayer)
        if (includeAllyBoard.includes(effect.target)) affectedPlayers.push(this.gameRef.currentPlayer)

        let effectsToInvoke = [];
        affectedPlayers.map(player => {
            const reversePlayers = player !== this.gameRef.currentPlayer

            for (let i = 0; i < this.gameRef.players[player].cardsOnBoard.length; i++) {
                const card = this.gameRef.players[player].cardsOnBoard[i]

                if (effect.effect === EFFECT_LIST.AOE_DEVOUR) {
                    if (helper < card.inGame.stats.damage) helper = card.inGame.stats.damage

                    // Marks minion as dead and filters it out, needs to be done before final words
                    this.gameRef.players[player].cardsOnBoard[i] = null
                }
                else if (effect.effect === EFFECT_LIST.DAMAGE || effect.effect === EFFECT_LIST.HEAL) {
                    if (effect.effect === EFFECT_LIST.DAMAGE) effect.value = -Math.abs(effect.value);
                    card.inGame.stats.health += effect.value

                    if (card.inGame.stats.health > card.stats[card.level - 1].health)
                        card.inGame.stats.health = card.stats[card.level - 1].health

                    // Place a null value in minion array if he died
                    if (card.inGame.stats.health <= 0) this.gameRef.players[player].cardsOnBoard[i] = null
                }

                const didMinionDie = this.gameRef.players[player].cardsOnBoard[i] === null
                const hasEffects = card.effects && card.effects.finalWords && card.effects.finalWords.length > 0
                if (hasEffects && didMinionDie) effectsToInvoke.push({ effect: card.effects.finalWords[0], reversePlayers })
            }

            //  Filters out dead minions, needs to be done before final words
            this.gameRef.players[player].cardsOnBoard = this.gameRef.players[player].cardsOnBoard.filter(card => card !== null)

            for (let i = 0; i < effectsToInvoke.length; i++) {
                this.invokeCardEffect(effectsToInvoke[i].effect, null, effectsToInvoke[i].reversePlayers)
            }
        })

        // Determines whose hero should be affected
        affectedPlayers = [];
        if (includeEnemyHero.includes(effect.target)) affectedPlayers.push(+!this.gameRef.currentPlayer)
        if (includeAllyHero.includes(effect.target)) affectedPlayers.push(this.gameRef.currentPlayer)

        affectedPlayers.map(player => {
            if (effect.effect === EFFECT_LIST.DAMAGE || effect.effect === EFFECT_LIST.HEAL) {
                if (effect.effect === EFFECT_LIST.DAMAGE) effect.value = -Math.abs(effect.value);
                this.gameRef.players[player].health += effect.value

                if (player.health > config.MAX_HERO_HEALTH) player.health = config.MAX_HERO_HEALTH;
                return player
                // Hero death means gameover, which is handled by socket logics
            }
        })

        // Utilize helper variable for effects outside the loop
        if (effect.effect === EFFECT_LIST.AOE_DEVOUR) {
            this.gameRef.players[this.gameRef.currentPlayer].health -= helper;
        }
    }

    checkCondition(card, condition) {
        const variableValue = this.getVariableValue(card, condition);
        if (variableValue === null) return false

        if (condition.keyWord === CardModel.Condition.KEY_WORD.MORE) return variableValue > condition.value;
        if (condition.keyWord === CardModel.Condition.KEY_WORD.LESS) return variableValue < condition.value;
        if (condition.keyWord === CardModel.Condition.KEY_WORD.EQUAL) return variableValue === condition.value;
    }

    getVariableValue(card, condition) {
        if (condition.variable === CardModel.Condition.VARIABLE.HEALTH) return card.inGame.stats.health
        if (condition.variable === CardModel.Condition.VARIABLE.DAMAGE) return card.inGame.stats.damage
        if (condition.variable === CardModel.Condition.VARIABLE.COST) return card.inGame.stats.cost

        if (condition.variable === CardModel.Condition.VARIABLE.RACE) return card.race
        if (condition.variable === CardModel.Condition.VARIABLE.CLASS) return card.role
        return null
    }
}

module.exports = Effect