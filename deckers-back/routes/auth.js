var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require("../models/user");
var Card = require("../models/card");

//==================================
// AUTH ROUTES

//  REGISTER ROUTES
router.get("/register", function(req, res) {
    res.render("auth/register");
});

//  Handle registration
router.post("/register", function(req, res) {

    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.redirect("/register");
        }

        Card.find({ cardClass: User.Classes[0] }, function(err, foundCards) {
            foundCards.forEach(function(card) {
                let newCard = {
                    card: card._id,
                    amount: 0,
                    level: 1
                }
                newUser.cards.push(newCard);
            })

            newUser.decks = [];
            newUser.currency = { gold: 100, gems: 0 };

            newUser.save(function(err) {
                if (err) return console.log("Register error");
            });
            passport.authenticate("local")(req, res, function() {
                res.redirect("/" + req.body.username);
            });
        })


    });
});

// LOGIN ROUTES
router.get("/login", function(req, res) {
    res.render("auth/login");
});

router.post("/login",
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/' + req.user.username);
    });

//  LOGOUT ROUTE
router.get("/logout", function(req, res) {
    console.log("Logged out!");
    req.logout();
    res.redirect("/campgrounds");
});

//  Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}

module.exports = router;
