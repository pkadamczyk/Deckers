var mongoose = require("mongoose");

const rarityList = Object.freeze({
    random: 0,
    common: 1,
    rare: 2,
    epic: 3,
    legendary: 4
});

const raceList = Object.freeze({
    dwarf: 0,
    forsaken: 1,
    order: 2,
    skaven: 3,
});

const roleList = Object.freeze({
    warrior: 0,
    hunter: 1,
    assasin: 2,
    mage: 3,
    knight: 4,
    priest: 5,
    warlock: 6,
    merchant: 7,
    spell: 8
});

const Effect = Object.freeze({
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

var cardSchema = new mongoose.Schema({
    name: String,
    description: String,
    rarity: {
        type: Number,
        enum: rarityList
    },

    race: {
        type: Number,
        enum: raceList
    },

    role: {
        type: Number,
        enum: roleList
    },

    stats: [{
        cost: Number,
        damage: Number,
        health: Number,
    }],

    isFree: {
        type: Boolean,
        default: false
    },

    canBeDropped: {
        type: Boolean,
        default: true
    },

    effects: {}
});

Object.assign(cardSchema.statics, {
    rarityList,
    raceList,
    roleList,
    Effect
});

module.exports = mongoose.model("Card", cardSchema);
