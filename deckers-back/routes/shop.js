var express = require("express");
var router = express.Router();

var Card = require("../models/card");
var User = require("../models/user");
var Chest = require("../models/chest");
var OptionGroup = require("../models/optionGroup");

router.get("/:username/shop", async function (req, res) {
    foundChests = await Chest.find({})
    let availableChests = foundChests.filter(chest => chest.isAvailable)
    res.send("profile/shop", { chests: availableChests, currencyList: Chest.currencyList });
    res.status(200).json({
        user: foundUser
    });
});

// /shop/buy/chest
// AJAX
router.post("/shop/buy/chest", isLoggedIn, function (req, res) {

    Chest.findOne({ name: req.body.chestName }, function (err, foundChest) {

        let cards = [];
        let currencyLeft;
        let cardAmounts = calculateCardAmounts(foundChest);

        // Get the count of all items
        let cardsInChest = cardAmounts.reduce((a, b) => a + b);

        new Promise((resolve, reject) => {
            User.findOne({ username: req.user.username }).exec(function (err, foundUser) {

                let currency = (foundChest.price.currency == 0) ? foundUser.currency.gold : foundUser.currency.gems;
                if (currency >= foundChest.price.amount) {
                    if (foundChest.price.currency == Chest.currencyList.gold) foundUser.currency.gold -= foundChest.price.amount;
                    else if (foundChest.price.currency == Chest.currencyList.gems) foundUser.currency.gems -= foundChest.price.amount;

                    currencyLeft = (foundChest.price.currency == Chest.currencyList.gold) ? foundUser.currency.gold : foundUser.currency.gems;

                    foundUser.save();
                    resolve()
                }
                else {
                    console.log("Not enough " + Object.keys(Chest.currencyList)[foundChest.price.currency]);
                    reject();
                    // TODO Error message
                }
            })
        }).then(function () {
            // Promise to find cards and return an array of found cards
            //  Define the rarity of random cards
            return new Promise((resolve, reject) => {
                OptionGroup.findOne({ short: "randomCardRarity" }).deepPopulate('options.option').exec(function (err, foundOptions) {
                    let max = foundOptions.options.reduce((a, b) => a + b.option.value, 0);

                    for (var j = 0; j < cardAmounts[0]; j++) {
                        let random = Math.random() * max;

                        let valueArray = foundOptions.options.map(el => el.option.value);
                        let x = valueArray.findIndex(function (el, i, array) {
                            let min = array.slice(0, i).reduce((x, y) => x + y, 0);

                            return (random > min && random <= (min + array[i]));
                        }) + 1;

                        // console.log("Random rarity is: " + Object.keys(Card.rarityList)[x]);
                        cardAmounts[x]++;
                    }
                    resolve();
                })
            })
        }).then(function () {
            return new Promise((resolve, reject) => {
                // Wait for rarity random, then random cards that will be added to player
                cardAmounts.splice(0, 1);
                cardAmounts.forEach(function (cardAmount, index) {
                    index++;

                    Card.countDocuments({ rarity: index }).exec(function (err, count) {
                        console.log("Cards amount: " + cardAmount + " " + Object.keys(Card.rarityList)[index]);
                        for (var i = 0; i < cardAmount; i++) {
                            let random = Math.floor(Math.random() * count);

                            // Again query all items but only fetch one offset by our random #
                            Card.findOne({ rarity: index }).skip(random).exec(function (err, foundCard) {
                                cards.push(foundCard);
                                if (cards.length == cardsInChest) resolve(cards)
                            })
                        }
                    })
                })
            })
        }).then(function (cards) {
            var msg = { cards: cards, currencyLeft: currencyLeft, chestCost: foundChest.price.amount }
            res.send(msg);

            // cards.forEach(function(card) {
            //     console.log(card.name);
            // })

            User.findOne({ username: req.user.username }).deepPopulate('cards.card').exec(function (err, foundUser) {

                let cardIndexes = cards.map(function (cardFromDb) {
                    return foundUser.cards.findIndex(function (card) { return cardFromDb.name == card.card.name; });
                })
                cardIndexes.forEach(function (cardIndex) { foundUser.cards[cardIndex].amount++ })

                foundUser.save()
            })
        });
    })
})

function calculateCardAmounts(chest) {
    let array = [];
    Object.keys(chest.cardAmount).forEach(function (key) {
        array.push(chest.cardAmount[key]);
    });
    array.splice(0, 1);
    return array;
}

//  Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
