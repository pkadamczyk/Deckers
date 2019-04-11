var mongoose = require("mongoose");
//var passportLocalMongoose = require("passport-local-mongoose"); new Auth introduced - Pszemek
const bcrypt = require("bcrypt"); // new Auth
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
    // added for future uses (already implemented in auth) - Pszemek
    email: String,
    profileImageUrl: String,
    //
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


// NEW AUTH - Pszemek
UserSchema.pre("save", async function(next) {
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
  
UserSchema.methods.comparePassword = async function(candidatePassword, next) {
    try {
      let isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
    } catch (err) {
      return next(err);
    }
  };

// UserSchema.plugin(passportLocalMongoose); new Auth introduced - Pszemek
UserSchema.plugin(deepPopulate);

const User = mongoose.model("User", UserSchema);

module.exports = User;
