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
    elf: 1,
    dragon: 2,
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

    stats: {
        cost: Number,
        amount: Number,
        damage: Number,
        armor: Number,
        heal: Number,
    }
});

Object.assign(cardSchema.statics, {
    rarityList,
    raceList
});

module.exports = mongoose.model("Card", cardSchema);
