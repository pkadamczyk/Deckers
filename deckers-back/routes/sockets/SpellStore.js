class Effect {
    constructor(target, effect, value) {
        this.target = target;
        this.effect = effect;
        this.value = value
    }
}

Effect.EFFECT_LIST = {
    HEAL: 1,
    DAMAGE: 2,
    SUMMON: 3,
}

Effect.TARGET_LIST = {
    NONE: 0,
    SINGLE_TARGET: 1,
    AOE_ENEMY: 2,
    AOE_ALLIES: 3,
    AOE_ALL: 4,
}

class Spell {
    constructor(effects) {
        this.effects = effects;
        this.cardsOnHand = null
    }

}

const coolSpell2 = new Spell([new Effect(Effect.TARGET_LIST.SINGLE_TARGET, Effect.EFFECT_LIST.DAMAGE, 2)])


