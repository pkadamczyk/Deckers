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
        SINGLE_TARGET: 1,
        AOE_ENEMY: 2,
        AOE_ALLIES: 3,
        AOE_ALL: 4,
        SELF: 5,
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
    }
});

Object.assign(cardSchema.statics, {
    rarityList,
    raceList,
    roleList,
    Effect
});

module.exports = mongoose.model("Card", cardSchema);
