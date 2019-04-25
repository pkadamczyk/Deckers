const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

var User = require("../models/user");
var Chest = require("../models/chest");
var Option = require("../models/option");

router.post("/register", async function (req, res, next) {
    try {
        let [user, availableChests] = await Promise.all([await User.create(req.body), await fetchChests()])
        user.currency = { gold: 200 }
        user.cards = []
        user.save()

        let [a, b, c, d, e, f] = await fetchOptionList("maxCardLevel", "upgradeCardCost", "commonUpgradeGoldCost", "rareUpgradeGoldCost", "epicUpgradeGoldCost", "legendaryUpgradeGoldCost")

        let { id, username, profileImageUrl } = user;
        let token = jwt.sign(
            {
                id,
                username,
                profileImageUrl
            },
            process.env.SECRET_KEY
        );
        return res.status(200).json({
            user,
            options: {
                maxCardLevel: a,
                upgradeCardCost: b,
                commonUpgradeGoldCost: c,
                rareUpgradeGoldCost: d,
                epicUpgradeGoldCost: e,
                legendaryUpgradeGoldCost: f
            },
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
    // finding a user
    try {
        let [user, availableChests] = await Promise.all([fetchUser(req.body.email), fetchChests()])

        let { id, username, profileImageUrl } = user;
        let isMatch = await user.comparePassword(req.body.password);
        if (isMatch) {

            let [a, b, c, d, e, f] = await fetchOptionList("maxCardLevel", "upgradeCardCost", "commonUpgradeGoldCost", "rareUpgradeGoldCost", "epicUpgradeGoldCost", "legendaryUpgradeGoldCost")

            let token = jwt.sign(
                {
                    id,
                    username,
                    profileImageUrl
                },
                process.env.SECRET_KEY
            );
            return res.status(200).json({
                user,
                options: {
                    maxCardLevel: a,
                    upgradeCardCost: b,
                    commonUpgradeGoldCost: c,
                    rareUpgradeGoldCost: d,
                    epicUpgradeGoldCost: e,
                    legendaryUpgradeGoldCost: f
                },
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
    foundChests = await Chest.find({})

    let availableChests = foundChests.filter(chest => chest.isAvailable)
    return availableChests;
}

async function fetchOptionList() {
    let arr = Array.from(arguments);
    arr = await Promise.all(arr.map(value => Option.findOne({ short: value })))
    return arr;
}