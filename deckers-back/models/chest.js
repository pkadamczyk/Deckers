var mongoose = require("mongoose");

const currencyList = Object.freeze({
    gold: 0,
    gems: 1
});

var chestSchema = new mongoose.Schema({

    name: String,
    price: {
        amount: Number,
        currency: {
            type: Number,
            enum: currencyList
        },
    },

    cardAmount: {
        random: Number,
        common: Number,
        rare: Number,
        epic: Number,
        legendary: Number
    },

    isAvailable: Boolean
});

Object.assign(chestSchema.statics, {
    currencyList,
});

module.exports = mongoose.model("Chest", chestSchema);
