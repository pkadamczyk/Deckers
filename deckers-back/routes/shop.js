var express = require("express");
var router = express.Router();

var Card = require("../models/card");
var User = require("../models/user");
var Chest = require("../models/chest");
var OptionGroup = require("../models/optionGroup");

// /shop/buy/chest
router.post("/:id/shop/buy/:chest", async function (req, res) {
    try {
        foundChest = await Chest.findOne({ name: req.params.chest })
        let cardAmounts = calculateCardAmounts(foundChest);

        // Get the count of all items
        let cardsInChest = cardAmounts.reduce((a, b) => a + b);
        foundUser = await User.findById(req.params.id).deepPopulate('cards.card')
        let currencyType = Object.keys(Chest.currencyList)[foundChest.price.currency]

        if (foundUser.currency[currencyType] >= foundChest.price.amount) {
            foundUser.currency[currencyType] -= foundChest.price.amount
        }
        else {
            console.log("Not enough " + Object.keys(Chest.currencyList)[foundChest.price.currency]);
            throw new Error("Error i chuj")
        }

        //  Define the rarity of random cards
        await randomCardsRarity(cardAmounts);

        // Wait for rarity random, then random cards that will be added to player
        cardAmounts.splice(0, 1);
        cards = await addCardsToArray(cardAmounts);

        // let msg = { cards: cards, currencyLeft: currencyLeft, chestCost: foundChest.price.amount }

        // nowe karty i wszystkie obecne karty, obecny hajs

        // res.send(msg);

        let cardIndexes = cards.map(function (cardFromDb) {
            // Add cards that player didnt have earlier
            if (foundUser.cards.findIndex(card => cardFromDb._id.equals(card.card._id)) === -1) {
                let newCard = {
                    card: cardFromDb._id,
                    amount: 0,
                    level: 1
                }
                foundUser.cards.push(newCard);
            }
            return foundUser.cards.findIndex(card => cardFromDb._id.equals(card.card._id))
        })
        cardIndexes.forEach(function (cardIndex) { foundUser.cards[cardIndex].amount++ })

        foundUser.save()
    } catch (err) {
        console.log(err)
        res.status(404).json({
            err: err.message
        });
    }

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

async function randomCardsRarity(cardAmounts) {
    foundOptions = await OptionGroup.findOne({ short: "randomCardRarity" }).deepPopulate('options.option')
    let max = foundOptions.options.reduce((a, b) => a + b.option.value, 0);

    for (var j = 0; j < cardAmounts[0]; j++) {
        let random = Math.random() * max;

        let valueArray = foundOptions.options.map(el => el.option.value);
        let x = valueArray.findIndex(function (el, i, array) {
            let min = array.slice(0, i).reduce((x, y) => x + y, 0);

            return (random > min && random <= (min + array[i]));
        }) + 1;

        console.log("Random rarity is: " + Object.keys(Card.rarityList)[x]);
        cardAmounts[x]++;
    }
}

async function addCardsToArray(cardAmounts) {
    let cards = [];

    cards = await Promise.all(cardAmounts.map(async function (cardAmount, index) {
        let arr = [];
        index++;

        let count = await Card.countDocuments({ rarity: index })
        console.log("Cards amount: " + cardAmount + " " + Object.keys(Card.rarityList)[index]);
        for (var i = 0; i < cardAmount; i++) {
            let random = Math.floor(Math.random() * count);

            // Again query all items but only fetch one offset by our random #
            let foundCard = await Card.findOne({ rarity: index }).skip(random)
            arr.push(foundCard);
        }
        return arr;
    }))

    return cards.reduce((total, amount) => {
        return total.concat(amount);
    }, []);;
} 