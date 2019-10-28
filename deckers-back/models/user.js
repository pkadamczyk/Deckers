const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // new Auth
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const tagList = {
    user: 0,
    admin: 1,
    tester: 2
}

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,

    currency: {
        gold: { type: Number, default: 200 },
        gems: { type: Number, default: 0 }
    },

    cards: [{
        card: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Card"
        },
        amount: { type: Number, default: 0 },
        level: { type: Number, default: 1 }
    }],

    decks: [{
        name: String,
        cards: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Card"
        }],
    }],

    inGame: { type: Boolean, default: false },

    currentGame: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game"
    },

    tag: {
        type: Number,
        default: 0,
        enum: tagList
    }
});

// NEW AUTH - Pszemek
UserSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        let hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    } catch (err) {
        return next(err);
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword, next) {
    try {
        let isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        return err;
    }
};

Object.assign(UserSchema.statics, {
    tagList,
});

// UserSchema.plugin(passportLocalMongoose); new Auth introduced - Pszemek
UserSchema.plugin(deepPopulate);

const User = mongoose.model("User", UserSchema);

module.exports = User;
