import { MAX_HERO_HEALTH } from "../game";
import { ENEMY_PORTRAIT_ID } from "../../../gameplay/components/EnemyHero";
import { PLAYER_PORTRAIT_ID } from "../../../gameplay/components/PlayerHero";

export const Effect = Object.freeze({
    EFFECT_LIST: {
        HEAL: 1,
        DAMAGE: 2,
        SUMMON: 3,
    },
    TARGET_LIST: {
        NONE: 0,
        SELF: 13,
        ENEMY_HERO: 14,
        ALLY_HERO: 15,

        AOE: {
            ALL: 1,
            ENEMY: 2,
            ALLY: 3,

            ALL_MINIONS: 4,
            ENEMY_MINIONS: 5,
            ALLY_MINIONS: 6,
        },

        SINGLE_TARGET: {
            ALL: 7,
            ENEMY: 8,
            ALLY: 9,

            ALL_MINIONS: 10,
            ENEMY_MINIONS: 11,
            ALLY_MINIONS: 12,
        },
    }

})

export function invokeEffect(effect, gameState, pickedTarget = null) {
    let newState = { ...gameState }

    if (effect.effect === Effect.EFFECT_LIST.DAMAGE) effect.value = -Math.abs(effect.value);
    const targetsMap = !(pickedTarget === null) ? determineSingleTarget(pickedTarget, gameState) : appendTargetsToMap(effect.target, gameState);

    // Handles heal and damage for now
    for (let [key, value] of targetsMap.entries()) {

        //  In case value is a card array
        if (Array.isArray(value) && !key.includes("minion")) {
            value = value.map(card => {
                let newHealth = card.inGame.stats.health + effect.value

                if (newHealth <= 0) return null;
                if (newHealth > card.stats[card.level - 1].health) newHealth = card.stats[card.level - 1].health

                card.inGame.stats = { ...card.inGame.stats, health: newHealth }
                return card;
            });
            value = value.filter(val => val !== null);
        }
        // In case of heroes
        else if (['enemyHeroHealth', 'playerHeroHealth'].includes(key)) {
            value += effect.value;
            if (value > MAX_HERO_HEALTH) value = MAX_HERO_HEALTH;
        }
        // In case of single target
        else {
            const minionIndex = +key.slice(-1)
            let minion = { ...value[minionIndex] };

            let newHealth = minion.inGame.stats.health + effect.value

            if (newHealth > minion.stats[minion.level - 1].health) newHealth = minion.stats[minion.level - 1].health

            minion.inGame.stats = { ...minion.inGame.stats, health: newHealth }

            // Prepare to save
            const keyName = key.includes("enemy-minion") ? "enemyCardsOnBoard" : "cardsOnBoard";

            let minionArray = value;
            if (newHealth <= 0) minionArray[minionIndex] = null;

            key = keyName
            value = minionArray.filter(val => val !== null);
        }

        newState[key] = value
    }

    return { ...newState };
}

function determineSingleTarget(target, state) {
    const { enemyCardsOnBoard, cardsOnBoard, enemyHeroHealth, playerHeroHealth } = state

    // Handles hero cases
    if (target === ENEMY_PORTRAIT_ID) return new Map().set('enemyHeroHealth', enemyHeroHealth);
    if (target === PLAYER_PORTRAIT_ID) return new Map().set('playerHeroHealth', playerHeroHealth);

    // Handles minion cases
    if (target.includes("enemy-minion")) return new Map().set(target, Array.from(enemyCardsOnBoard));
    if (target.includes("player-minion")) return new Map().set(target, Array.from(cardsOnBoard));
}

function appendTargetsToMap(target, state) {
    const { enemyCardsOnBoard, cardsOnBoard, enemyHeroHealth, playerHeroHealth } = state;
    let targetsMap = new Map();

    const { TARGET_LIST } = Effect
    const includeEnemyBoard = [TARGET_LIST.AOE.ALL, TARGET_LIST.AOE.ENEMY, TARGET_LIST.AOE.ALL_MINIONS, TARGET_LIST.AOE.ENEMY_MINIONS]
    const includeAllyBoard = [TARGET_LIST.AOE.ALL, TARGET_LIST.AOE.ALLY, TARGET_LIST.AOE.ALL_MINIONS, TARGET_LIST.AOE.ALLY_MINIONS]

    const includeEnemyHero = [TARGET_LIST.AOE.ALL, TARGET_LIST.AOE.ENEMY, TARGET_LIST.ENEMY_HERO]
    const includeAllyHero = [TARGET_LIST.AOE.ALL, TARGET_LIST.AOE.ALLY, TARGET_LIST.ALLY_HERO]

    if (includeEnemyBoard.includes(target)) targetsMap.set('enemyCardsOnBoard', Array.from(enemyCardsOnBoard));
    if (includeAllyBoard.includes(target)) targetsMap.set('cardsOnBoard', Array.from(cardsOnBoard));

    if (includeEnemyHero.includes(target)) targetsMap.set('enemyHeroHealth', enemyHeroHealth);
    if (includeAllyHero.includes(target)) targetsMap.set('playerHeroHealth', playerHeroHealth);

    return targetsMap;
}