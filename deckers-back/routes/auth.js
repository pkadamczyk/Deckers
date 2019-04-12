const express = require("express");
const router = express.Router();
var User = require("../models/user");
const jwt = require("jsonwebtoken");

router.post("/register", async function (req, res, next) {
    try {
        let user = await User.create(req.body);

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
            id,
            username,
            profileImageUrl,
            cards,
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
        let user = await User.findOne({
            email: req.body.email
        });
        let { id, username, profileImageUrl } = user;
        let isMatch = await user.comparePassword(req.body.password);
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
                id,
                username,
                profileImageUrl,
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
