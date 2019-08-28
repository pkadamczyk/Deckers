const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Chest = require("../models/chest");
const Card = require("../models/card");

router.post("/register", async function (req, res, next) {
    try {
        let [user, availableChests] = await Promise.all([await User.create(req.body), await fetchChests()])

        let { id, username, email } = user;
        let token = jwt.sign(
            {
                id,
                username,
                email
            },
            process.env.SECRET_KEY
        );

        user = prepareUserData(user)
        return res.status(200).json({
            user,
            availableChests,
            token
        });
    } catch (err) {
        if (err.code === 11000) {
            err.message = "Sorry, that username and/or email is taken";
        }
        return next({
            status: 666,
            message: err.message
        });
    }
});

router.post("/login", async function (req, res, next) {
    try {
        const cardsPromise = Card.find({ isFree: true })
        let [user, availableChests, freeCards] = await Promise.all([fetchUser(req.body.email), fetchChests(), cardsPromise])

        const cardsToConcat = freeCards.filter(card => !user.cards.some(c => c.card._id.equals(card._id)))
        user.cards = user.cards.concat(cardsToConcat.map(card => ({ level: 1, amount: 0, card })));

        let { id, username, email } = user;
        let isMatch = await user.comparePassword(req.body.password);
        if (isMatch) {

            let token = jwt.sign(
                {
                    id,
                    username,
                    email
                },
                process.env.SECRET_KEY
            );
            console.log(`${username} has loged in`)

            user = prepareUserData(user)
            return res.status(200).json({
                user,
                availableChests,
                token
            });
        } else {
            return next({
                status: 400,
                message: "Invalid Email/Password."
            });
        }
    } catch (e) {
        console.log(e)
        return next({ status: 400, message: "Invalid Email/Password." });
    }
});

module.exports = router;

async function fetchUser(email) {
    let foundUser = await User.findOne({ email: email }).deepPopulate('cards.card decks.cards.card')
    return foundUser;
}

async function fetchChests() {
    const foundChests = await Chest.find({})
    const availableChests = foundChests.filter(chest => chest.isAvailable);

    return availableChests
}

function prepareUserData(user) {
    const data = { ...user.toObject() }
    delete data.password;
    delete data.__v;

    return data
}