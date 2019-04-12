var express = require("express");
var router = express.Router();

var Card = require("../models/card");
var User = require("../models/user");

// INDEX ROUTE
router.get("/cards", function (req, res) {
    Card.find({}, function (err, cards) {
        if (err) {
            console.log(err)
        }
        else {
            res.render("cards/index", { cards: cards });
        }
    });
});

// CREATE ROUTE
router.post("/cards", function (req, res) {
    //new item logic
    var newCard = req.body.new
    newCard.stats = req.body.stats;

    Card.create(newCard, function (err, createdCard) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/cards");
        }
    })
});

// NEW ROUTE
router.get("/cards/new", function (req, res) {
    res.render("cards/new", { rarityList: Card.rarityList, raceList: Card.raceList });
})

// SHOW ROUTE
router.get("/cards/:id", function (req, res) {

    Card.findById(req.params.id, function (err, foundCard) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("cards/show", { card: foundCard, Classes: User.Classes });
        }
    });
});

//  EDIT ROUTE
router.get("/cards/:id/edit", function (req, res) {

    Card.findById(req.params.id, function (err, foundCard) {
        if (err) return res.redirect("/cards");
        res.render("cards/edit", { card: foundCard, rarityList: Card.rarityList });
    });
});

//  UPDATE ROUTE
router.put("/cards/:id", function (req, res) {
    var newCard = req.body.new

    // find and update the correct item
    Card.findByIdAndUpdate(req.params.id, newCard, function (err, updatedCard) {
        if (err) {
            res.redirect("/cards");
        }
        else {
            //redirect somewhere(show page)
            res.redirect("/cards/" + req.params.id);
        }
    });
});

//  DESTROY ROUTE
router.delete("/cards/:id", function (req, res) {
    Card.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/cards");
        }
        else {
            res.redirect("/cards");
        }
    });
});

module.exports = router;
