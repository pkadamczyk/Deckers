var express = require("express");
var router = express.Router();

var Card = require("../models/card");
var User = require("../models/user");

// INDEX ROUTE
router.get("/cards", async function (req, res) {
    try {
        const cards = await Card.find({})

        res.status(200).json({ cards });
    } catch (err) {
        console.log(err)
    }
});

// CREATE ROUTE
router.post("/cards", async function (req, res) {
    // new item logic
    const newCard = req.body;

    await Card.create(newCard)
    res.status(200).json({});
});

// NEW ROUTE
router.get("/cards/new", async function (req, res) {
    const cards = await Card.find({})
    res.status(200).json({ rarityList: Card.rarityList, raceList: Card.raceList, roleList: Card.roleList, Effect: Card.Effect, cards });
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
