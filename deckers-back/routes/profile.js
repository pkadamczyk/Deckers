var express = require("express");
var router = express.Router();

var OptionGroup = require("../models/optionGroup");
var User = require("../models/user");
var Card = require("../models/card");

router.get("/:id/profile", async function(req, res) {
    User.findOne({ username: req.params.username }, function(err, foundUser) {
        if (err) return res.redirect("back");
        res.render("profile", { user: foundUser });
    });
});

router.get("/:username/cards", isLoggedIn, function(req, res) {
    User.findOne({ username: req.params.username }).deepPopulate('cards.card').exec(function(err, foundUser) {

        OptionGroup.findOne({ short: "upgradeCardCost" }).deepPopulate('options.option').exec(function(err, upgradeCardCost) {
            OptionGroup.findOne({ short: "commonUpgradeGoldCost" }).deepPopulate('options.option').exec(function(err, commonUpgradeGoldCost) {
                OptionGroup.findOne({ short: "rareUpgradeGoldCost" }).deepPopulate('options.option').exec(function(err, rareUpgradeGoldCost) {
                    OptionGroup.findOne({ short: "epicUpgradeGoldCost" }).deepPopulate('options.option').exec(function(err, epicUpgradeGoldCost) {
                        OptionGroup.findOne({ short: "legendaryUpgradeGoldCost" }).deepPopulate('options.option').exec(function(err, legendaryUpgradeGoldCost) {
                            OptionGroup.findOne({ short: "maxCardLevel" }).deepPopulate('options.option').exec(function(err, maxCardLevel) {
                                if (err) return res.redirect("back");
                                let upgradeGoldCost = [commonUpgradeGoldCost, rareUpgradeGoldCost, epicUpgradeGoldCost, legendaryUpgradeGoldCost]

                                res.render("./profile/cards", {
                                    user: foundUser,
                                    upgradeCardCost: upgradeCardCost,
                                    upgradeGoldCost: upgradeGoldCost,
                                    maxCardLevel: maxCardLevel,
                                });
                            })
                        })
                    })
                })
            })
        });
    })
});

router.get("/:username/play", isLoggedIn, function(req, res) {
    User.findOne({ username: req.params.username }).deepPopulate('decks.cards.card').exec(function(err, foundUser) {
        if (err) return res.redirect("back");
        res.render("./profile/play", { user: foundUser });

    });
});

// AJAX
router.post("/:username/cards/upgrade", isLoggedIn, function(req, res) {

    User.findOne({ username: req.params.username }).deepPopulate('cards.card').exec(function(err, foundUser) {

        let index = foundUser.cards.findIndex(card => req.body.cardName == card.card.name);
        let card = foundUser.cards[index];

        // Max level check
        new Promise((resolve, reject) => {
            OptionGroup.findOne({ short: "maxCardLevel" }).deepPopulate('options.option').exec(function(err, foundOptionGroup) {
                // console.log(card.card.rarity + " : " + foundOptionGroup.options[card.card.rarity - 1].option.value);
                if (card.level >= foundOptionGroup.options[card.card.rarity - 1].option.value) res.send({ error: "Card already on max level" });
                resolve()
            })
            // Gold check
        }).then(function() {
            return new Promise((resolve, reject) => {
                let optionName = Object.keys(Card.rarityList)[card.card.rarity] + "UpgradeGoldCost";
                OptionGroup.findOne({ short: optionName }).deepPopulate('options.option').exec(function(err, foundOptionGroup) {
                    if (foundUser.currency.gold < foundOptionGroup.options[card.level].option.value) res.send({ error: "Not enough gold" });
                    else {
                        foundUser.currency.gold -= foundOptionGroup.options[card.level].option.value;
                        console.log(foundUser.currency.gold);
                        resolve()
                    }
                })
            })
        }).then(function() {
            return new Promise((resolve, reject) => {
                OptionGroup.findOne({ short: "upgradeCardCost" }).deepPopulate('options.option').exec(function(err, foundOptionGroup) {
                    if (card.amount >= foundOptionGroup.options[card.level].option.value) {
                        // Substract cards from player eq
                        foundUser.cards[index].amount -= foundOptionGroup.options[card.level].option.value;
                        foundUser.cards[index].level++;

                        let msg = {
                            currentLevel: foundUser.cards[index].level,
                            newAmount: foundUser.cards[index].amount,
                            cardsToNextLevel: foundOptionGroup.options[card.level].option.value
                        }
                        res.send(msg);
                        foundUser.save();
                    }
                })
            })
        })
    })
});

//  Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
