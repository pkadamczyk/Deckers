var express = require("express");
var router = express.Router();

var Chest = require("../models/chest");
// var User = require("../models/user");

// INDEX ROUTE
router.get("/chests", function(req, res) {
    Chest.find({}, function(err, chests) {
        if (err) {
            console.log(err)
        }
        else {
            res.render("chests/index", { chests: chests });
        }
    });
});

// AJAX ROUTE, ENABLE CHEST
router.post("/chest/enable", function(req, res) {
    // req.body.chestName
    Chest.findById(req.body.chestId, function(err, foundChest) {
        if (err) console.log(err)
        else {
            foundChest.isAvailable = !foundChest.isAvailable;
            foundChest.save();
            // var msg = {
            //     cards: cards
            // }
            res.send();

        }
    });
});

// CREATE ROUTE
router.post("/chests", function(req, res) {
    let newChest = req.body.new
    newChest.cardAmount = req.body.cardAmount;
    newChest.price = req.body.price;

    Chest.create(newChest, function(err, createChest) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/chests");
        }
    })
});

// NEW ROUTE
router.get("/chests/new", function(req, res) {
    res.render("chests/new", { currencyList: Chest.currencyList });
})

// SHOW ROUTE
router.get("/chests/:id", function(req, res) {

    Chest.findById(req.params.id, function(err, foundChest) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("chests/show", { chest: foundChest });
        }
    });
});

//  EDIT ROUTE
router.get("/chests/:id/edit", function(req, res) {

    Chest.findById(req.params.id, function(err, foundChest) {
        if (err) return res.redirect("/chests");
        res.render("chests/edit", { chest: foundChest, currencyList: Chest.currencyList });
    });
});

//  UPDATE ROUTE
router.put("/chests/:id", function(req, res) {
    let newChest = req.body.new
    newChest.cardAmount = req.body.cardAmount;
    newChest.price = req.body.price;

    // find and update the correct item
    Chest.findByIdAndUpdate(req.params.id, newChest, function(err, updatedChest) {
        if (err) {
            res.redirect("/chests");
        }
        else {
            //redirect somewhere(show page)
            res.redirect("/chests/" + req.params.id);
        }
    });
});

//  DESTROY ROUTE
router.delete("/chests/:id", function(req, res) {
    Chest.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/chests");
        }
        else {
            res.redirect("/chests");
        }
    });
});

module.exports = router;
