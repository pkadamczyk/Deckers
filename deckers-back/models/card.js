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
    }]
});

Object.assign(cardSchema.statics, {
    rarityList,
    raceList,
    roleList
});

module.exports = mongoose.model("Card", cardSchema);
