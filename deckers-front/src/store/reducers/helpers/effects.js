import { MAX_HERO_HEALTH } from "../game";

const Effect = Object.freeze({
    EFFECT_LIST: {
        HEAL: 1,
        DAMAGE: 2,
        SUMMON: 3,
    },
    TARGET_LIST: {
        NONE: 0,

        AOE: {
            ALL: 1,
            ENEMY: 2,
            ALLY: 3,

            ALL_MINIONS: 4,
            ENEMY_MINIONS: 5,
            ALLY_MINIONS: 6,
        },

        SINGLE_TARGET: 7,
        SELF: 8,
        ENEMY_HERO: 9,
        ALLY_HERO: 10,
    }

})

export function invokeEffect(effect, gameState) {
    let newState = { ...gameState }

    if (effect.effect === Effect.EFFECT_LIST.DAMAGE) effect.value = -Math.abs(effect.value);
    const targetsMap = appendTargetsToMap(effect.target, gameState);

    // Handles heal and damage for now
    for (let [key, value] of targetsMap.entries()) {
        //  In case value is a card array
        if (Array.isArray(value)) {
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
        else {
            value += effect.value;
            if (value > MAX_HERO_HEALTH) value = MAX_HERO_HEALTH;
        }
        newState[key] = value
    }

    debugger
    return { ...newState };
}

function appendTargetsToMap(target, state) {
    const { enemyCardsOnBoard, cardsOnBoard, enemyHeroHealth, playerHeroHealth } = state;
    let targetsMap = new Map();

    const { TARGET_LIST } = Effect
    const includeEnemyBoard = [TARGET_LIST.AOE.ALL, TARGET_LIST.AOE.ENEMY, TARGET_LIST.AOE.ALL_MINIONS, TARGET_LIST.AOE.ENEMY_MINIONS]
    const includeAllyBoard = [TARGET_LIST.AOE.ALL, TARGET_LIST.AOE.ALLY, TARGET_LIST.AOE.ALL_MINIONS, TARGET_LIST.AOE.ALLY_MINIONS]

    const includeEnemyHero = [TARGET_LIST.AOE.ALL, TARGET_LIST.AOE.ENEMY, TARGET_LIST.ENEMY_HERO]
    const includeAllyHero = [TARGET_LIST.AOE.ALL, TARGET_LIST.AOE.ALLY, TARGET_LIST.ALLY_HERO]

    if (includeAllyBoard.includes(target)) targetsMap.set('enemyCardsOnBoard', Array.from(enemyCardsOnBoard));
    if (includeEnemyBoard.includes(target)) targetsMap.set('cardsOnBoard', Array.from(cardsOnBoard));

    if (includeEnemyHero.includes(target)) targetsMap.set('enemyHeroHealth', enemyHeroHealth);
    if (includeAllyHero.includes(target)) targetsMap.set('playerHeroHealth', playerHeroHealth);

    return targetsMap;
}
