var mongoose = require("mongoose");
var User = require("./card");

const rarityList = Object.freeze({
    random: 0,
    common: 1,
    rare: 2,
    epic: 3,
    legendary: 4
});

var cardSchema = new mongoose.Schema({
    cardClass: {
        type: String,
        enum: User.Classes
    },

    name: String,
    description: String,
    rarity: {
        type: Number,
        enum: rarityList
    },

    stats: {
        cost: Number,
        amount: Number,
        damage: Number,
        armor: Number,
        heal: Number,

        //  Warrior specyfic
        armorToDamage: Number,
        armorToHeal: Number,
    }
});

Object.assign(cardSchema.statics, {
    rarityList,
});

module.exports = mongoose.model("Card", cardSchema);
