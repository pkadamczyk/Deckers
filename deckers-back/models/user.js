var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var deepPopulate = require('mongoose-deep-populate')(mongoose);

const classes = Object.freeze({
    Warrior: 'warrior',
    Rogue: 'rogue',
    Mage: 'mage',
});

const Classes = Object.keys(classes).map(function(key) {
    return classes[key];
});

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    userClass: {
        type: String,
        enum: Classes,
    },

    currency: {
        gold: Number,
        gems: Number
    },

    cards: [{
        card: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Card"
        },
        amount: Number,
        level: Number
    }],

    decks: [{
        name: String,
        cards: [{
            card: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Card"
            }
        }],
    }],

    inGame: Boolean,

    currentGame: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game"
    }
});

Object.assign(UserSchema.statics, {
    Classes,
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(deepPopulate);

module.exports = mongoose.model("User", UserSchema);
