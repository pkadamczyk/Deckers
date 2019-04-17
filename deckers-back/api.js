const express = require("express");
const router = express.Router();

const Chest = require("./models/chest");
const User = require("./models/user");
const Option = require("./models/option");
const Card = require("./models/card");

// Route for card upgrade
// Currently not working, need refactor
router.post("/:id/cards/upgrade", async function (req, res) {
    let foundUser = await fetchUser(req.params.id);

    let index = foundUser.cards.findIndex(card => req.body.cardName == card.card.name);
    let card = foundUser.cards[index];

    try {
        if (Promise.all(levelCheck(card), goldCheck(card, username)).some(el => !el)) throw "error";
    }
    catch (error) {
        console.error(error);
    }
    // foundUser.currency.gold -= foundOptionGroup.options[card.level].option.value;
    // console.log(foundUser.currency.gold);

    let optionName = Object.keys(Card.rarityList)[card.card.rarity] + "UpgradeGoldCost";
    upgradeCardCost = Option.findOne({ short: "upgradeCardCost" });
    upgradeGoldCost = Option.findOne({ short: optionName });
    [upgradeCardCost, upgradeGoldCost] = Promise.all(upgradeCardCost, upgradeGoldCost);
    console.log(upgradeCardCost);

    if (card.amount >= upgradeCardCost.options[card.level].option.value) {
        // Substract cards from player eq
        foundUser.cards[index].amount -= upgradeCardCost.options[card.level].option.value;
        foundUser.cards[index].level++;

        foundUser.currency.gold -= upgradeGoldCost.options[card.level].option.value;

        // let msg = {
        //     currentLevel: foundUser.cards[index].level,
        //     newAmount: foundUser.cards[index].amount,
        //     cardsToNextLevel: upgradeCardCost.options[card.level].option.value
        // }

        // res.status(200).json({
        //     user: foundUser
        // });
        // foundUser.save();
    }
});

// Route for buying chests
router.post("/:id/shop/buy/:chest", async function (req, res) {
    try {
        let [foundChest, foundUser] = await Promise.all([await Chest.findOne({ name: req.params.chest }), await User.findById(req.params.id).deepPopulate('cards.card')])
        let cardAmounts = calculateCardAmounts(foundChest);

        let currencyType = Object.keys(Chest.currencyList)[foundChest.price.currency]
        if (foundUser.currency[currencyType] >= foundChest.price.amount) {
            foundUser.currency[currencyType] -= foundChest.price.amount
        }
        else {
            console.log("Not enough " + Object.keys(Chest.currencyList)[foundChest.price.currency]);
            throw new Error("Not enough currency")
        }

        //  Define the rarity of random cards
        await randomCardsRarity(cardAmounts);

        // Wait for rarity random, then random cards that will be added to player
        cards = await addCardsToArray(cardAmounts);

        let cardIndexes = cards.map(function (cardFromDb) {
            // Add cards that player didnt have earlier
            if (foundUser.cards.findIndex(card => cardFromDb._id.equals(card.card._id)) === -1) {
                let newCard = { card: cardFromDb._id }
                foundUser.cards.push(newCard);
            }
            return foundUser.cards.findIndex(card => cardFromDb._id.equals(card.card._id))
        })
        cardIndexes.forEach(cardIndex => foundUser.cards[cardIndex].amount++);

        cards.forEach(card => console.log(card.name))

        res.status(200).json({
            newCards: cards,
            currentCards: foundUser.cards,
            currency: foundUser.currency,
        });

        foundUser.save()
    } catch (err) {
        console.log(err)
        res.status(404).json({
            err: err.message
        });
    }
});

// Create new deck
router.post("/:usr_id/decks/create", async function (req, res) {
    let newDeck = {
        cards: [],
        name: req.body.name
    };
    let foundUser = await fetchUser(req.params.usr_id);
    let indexArr = req.body.cards.map(card_id => foundUser.cards.findIndex(card => card._id.equals(card_id)))

    indexArr.forEach(index => newDeck.card.push(foundUser.cards[index].card._id))

    console.log("New deck: " + newDeck);
    // foundUser.decks.push(newDeck);
    foundUser.decks.push(newDeck);

    res.status(200).json({
        decks: foundUser.decks,
    });

    // foundUser.save();
})

// delete deck
router.post("/:usr_id/decks/:deck_id", async function (req, res) {
    let newDeck = {
        cards: [],
        name: req.body.name
    };
    let foundUser = await fetchUser(req.params.usr_id);

    // Find index of deleted deck
    let idx = foundUser.decks.findIndex(deck => deck._id.equals(req.params.deck_id));
    if (idx !== -1) foundUser.decks.splice(idx, 1);

    res.status(200).json({
        decks: foundUser.decks,
    });

    // foundUser.save();
})

async function fetchUser(id) {
    let foundUser = await User.findById(id).deepPopulate('cards.card');
    return foundUser;
}

async function fetchOptionsMany() {
    arr = Array.from(arguments);
    arr = await Promise.all(arr.map(value => Option.findOne({ short: value })))
    return arr;
}

async function levelCheck(card) {
    foundOption = await Option.findOne({ short: "maxCardLevel" });
    if (card.level >= foundOption.options[card.card.rarity - 1].option.value) return false;
    return true;
}

async function goldCheck(card, user) {
    let optionName = Object.keys(Card.rarityList)[card.card.rarity] + "UpgradeGoldCost";
    foundOption = await Option.findOne({ short: optionName })
    if (user.currency.gold < foundOption.options[card.level].option.value) return false
    return false;
}

function calculateCardAmounts(chest) {
    let array = [];
    Object.keys(chest.cardAmount).forEach(key => array.push(chest.cardAmount[key]))
    array.splice(0, 1);
    return array;
}

async function randomCardsRarity(cardAmounts) {
    let foundOption = await Option.findOne({ short: "randomCardRarity" })
    let max = foundOption.values.reduce((a, b) => a + b, 0);

    for (var j = 0; j < cardAmounts[0]; j++) {
        let random = Math.random() * max;

        let valueArray = foundOption.values;
        let x = valueArray.findIndex(function (el, i, array) {
            let min = array.slice(0, i).reduce((x, y) => x + y, 0);

            return (random > min && random <= (min + array[i]));
        }) + 1;

        console.log("Random rarity is: " + Object.keys(Card.rarityList)[x]);
        cardAmounts[x]++;
    }

    cardAmounts.splice(0, 1);
    return cardAmounts;
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

module.exports = router;