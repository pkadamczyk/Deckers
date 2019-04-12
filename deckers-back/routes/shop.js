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
router.post("/:id/shop/buy/:chest", async function (req, res) {

    foundChest = await Chest.findOne({ name: req.params.chest })

    let cards = [];
    // let currencyLeft;
    let cardAmounts = calculateCardAmounts(foundChest);

    // Get the count of all items
    let cardsInChest = cardAmounts.reduce((a, b) => a + b);

    foundUser = await User.findOne({ username: req.params.id })

    let currencyType = Object.keys(Chest.currencyList)[foundChest.price.currency]

    if (foundUser.currency[currencyType] >= foundChest.price.amount) {
        foundUser.currency[currencyType] -= foundChest.price.amount

        // foundUser.save();
    }
    else {
        console.log("Not enough " + Object.keys(Chest.currencyList)[foundChest.price.currency]);
        // TODO Error message
    }

    // Promise to find cards and return an array of found cards
    //  Define the rarity of random cards
    foundOptions = await OptionGroup.findOne({ short: "randomCardRarity" }).deepPopulate('options.option')
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


    // Wait for rarity random, then random cards that will be added to player
    cardAmounts.splice(0, 1);
    cardAmounts.forEach(async function (cardAmount, index) {
        index++;

        let count = await Card.countDocuments({ rarity: index })
        console.log("Cards amount: " + cardAmount + " " + Object.keys(Card.rarityList)[index]);
        for (var i = 0; i < cardAmount; i++) {
            let random = Math.floor(Math.random() * count);

            // Again query all items but only fetch one offset by our random #
            let foundCard = await Card.findOne({ rarity: index }).skip(random)
            cards.push(foundCard);
        }
        console.log(`${cards.length} : ${cardsInChest}`)
    })

    // let msg = { cards: cards, currencyLeft: currencyLeft, chestCost: foundChest.price.amount }
    // res.send(msg);

    // cards.forEach(function(card) {
    //     console.log(card.name);
    // })

    let cardIndexes = cards.map(function (cardFromDb) {
        return foundUser.cards.findIndex(function (card) { return cardFromDb.name == card.card.name; });
    })
    cardIndexes.forEach(function (cardIndex) { foundUser.cards[cardIndex].amount++ })

    // foundUser.save()
});

function calculateCardAmounts(chest) {
    let array = [];
    Object.keys(chest.cardAmount).forEach(function (key) {
        array.push(chest.cardAmount[key]);
    });
    array.splice(0, 1);
    return array;
}

module.exports = router;
