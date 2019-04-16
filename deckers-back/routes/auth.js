const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

var User = require("../models/user");
var Chest = require("../models/chest");

router.post("/register", async function (req, res, next) {
    try {
        let [user, availableChests] = await Promise.all([await User.create(req.body), await fetchChests()])

        user.cards = []
        user.save()

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
        console.log("a")
        let [user, availableChests] = await Promise.all([fetchUser(req.body.email), fetchChests()])
        console.log("aa")

        let { id, username, profileImageUrl } = user;
        let isMatch = await user.comparePassword(req.body.password);
        console.log(isMatch)
        if (isMatch) {
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
                // optionslist
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
        return next({ status: 400, message: "Invalid Email/Password." });
    }
});

module.exports = router;

async function fetchUser(email) {
    let foundUser = await User.findOne({ email: email }).deepPopulate('cards.card')
    return foundUser;
}

async function fetchChests() {
    foundChests = await Chest.find({})

    let availableChests = foundChests.filter(chest => chest.isAvailable)
    return availableChests;
}