const express = require("express");
const router = express.Router();

const Chest = require("./models/chest");
const User = require("./models/user");
const Option = require("./models/option");
const Card = require("./models/card");

// Route for card upgrade
router.post("/:usr_id/:card_id/upgrade", async function (req, res) {

    try {
        let foundUser = await fetchUser(req.params.usr_id);

        let index = foundUser.cards.findIndex(card => req.params.card_id == card._id);
        let card = foundUser.cards[index];

        let [levelCheckResult, goldCheckResult, cardsCheckResult] = await Promise.all([levelCheck(card), goldCheck(card, foundUser), cardsCheck(card, foundUser)])

        if (!levelCheckResult) throw new Error("Card already on max level");
        if (!goldCheckResult) throw new Error("Not enough gold");
        if (!cardsCheckResult) throw new Error("Not enough cards");

        let optionName = Object.keys(Card.rarityList)[card.card.rarity] + "UpgradeGoldCost";
        let upgradeCardCost = Option.findOne({ short: "upgradeCardCost" });
        let upgradeGoldCost = Option.findOne({ short: optionName });
        [upgradeCardCost, upgradeGoldCost] = await Promise.all([upgradeCardCost, upgradeGoldCost]);

        // Substract cards and gold from player eq
        foundUser.cards[index].amount -= upgradeCardCost.values[card.level];
        foundUser.currency.gold -= upgradeGoldCost.values[card.level];

        //  Add another level to upgraded card
        foundUser.cards[index].level++;

        res.status(200).json({
            currency: foundUser.currency,
            cards: foundUser.cards
        });
        foundUser.save();

    }
    catch (err) {
        console.log(err)
        res.status(404).json({
            err: err.message
        });
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
    try {
        let newDeck = {
            cards: [],
            name: req.body.name
        };
        let foundUser = await fetchUser(req.params.usr_id);
        let indexArr = req.body.cards.map(card_id => foundUser.cards.findIndex(card => card._id.equals(card_id)))

        indexArr.forEach(index => newDeck.cards.push(foundUser.cards[index].card._id))

        foundUser.decks.push(newDeck);
        await foundUser.deepPopulate("decks.cards");

        res.status(200).json({
            decks: foundUser.decks,
        });

        foundUser.save();
    } catch (err) {
        console.log(err)
        res.status(404).json({
            err: err.message
        });
    }
})

// delete deck
router.post("/:usr_id/decks/:deck_id", async function (req, res) {
    try {
        let foundUser = await fetchUser(req.params.usr_id);

        // Find index of deleted deck
        let idx = foundUser.decks.findIndex(deck => deck._id.equals(req.params.deck_id));

        if (idx == -1) throw new Error("Deck not found");
        foundUser.decks.splice(idx, 1);

        res.status(200).json({
            decks: foundUser.decks,
        });

        foundUser.save();
    } catch (err) {
        console.log(err)
        res.status(404).json({
            err: err.message
        });
    }
})

// update deck
router.put("/:usr_id/decks/:deck_id", async function (req, res) {
    try {
        let newDeck = {
            cards: [],
            name: req.body.name
        };
        let foundUser = await fetchUser(req.params.usr_id);

        let indexArr = req.body.cards.map(card_id => foundUser.cards.findIndex(card => card._id.equals(card_id)))
        indexArr.forEach(index => newDeck.cards.push(foundUser.cards[index].card._id))

        let idx = foundUser.decks.findIndex(deck => deck._id.equals(req.params.deck_id));
        if (idx == -1) throw new Error("Deck not found");

        foundUser.decks.splice(idx, 1, newDeck);
        await foundUser.deepPopulate("decks.cards");

        res.status(200).json({
            decks: foundUser.decks,
        });

        foundUser.save();
    } catch (err) {
        console.log(err)
        res.status(404).json({
            err: err.message
        });
    }
})

// Abandon game endpoint
router.post("/:usr_id/abandon", async function (req, res) {
    try {
        let user = await User.findById(req.user.usr_id)

        if (!user.inGame) throw new Error("User is not in game");

        foundUser.inGame = false;
        foundUser.save()

        res.status(200).json({});

    } catch (err) {
        console.log(err)
        res.status(404).json({
            err: err.message
        });
    }
})

// Join game endpoint
router.post("/:usr_id/game/:game_id", async function (req, res) {

    // need deck

    try {
        let [foundGame, user] = await Promise.all([Game.findById(req.params.game_id).deepPopulate('players'), User.findById(req.params.usr_id).deepPopulate('decks.cards.card')]);
        if (foundGame.isFinished) throw new Error("Game finished");
        if (user.inGame) throw new Error("User already in some game");

        // Handle wrong user sytuation
        if (foundGame.players.findIndex(player => player.username == req.user.username) == -1) throw new Error("No such user in game data");

        let gameDeck = [];
        let role;

        //  TODO Use declared deck instead of 0 index
        for (var i = 0; i < user.decks[0].cards.length; i++) {
            for (var j = 0; j < user.decks[0].cards[i].card.stats.amount; j++) {
                var newCard = {
                    card: user.decks[0].cards[i].card
                }
                gameDeck.push(newCard)
            }
        }

        // Shuffle deck
        gameDeck = shuffle(gameDeck);

        role = foundGame.players.findIndex(player => player.username == req.user.username)
        console.log("Role: " + role);

        // TODO Response not declared in docs
        // res.render("game", {
        //     player: user,
        //     role: role,
        //     deck: gameDeck,
        //     GAME: foundGame
        // });
    } catch (err) {
        console.log(err)
        res.status(404).json({
            err: err.message
        });
    }
})

function shuffle(array) {
    var m = array.length,
        t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

async function fetchUser(id) {
    let foundUser = await User.findById(id).deepPopulate('cards.card');
    return foundUser;
}

async function fetchOptionsMany() {
    let arr = Array.from(arguments);
    let arr = await Promise.all(arr.map(value => Option.findOne({ short: value })))
    return arr;
}

async function levelCheck(card) {
    let foundOption = await Option.findOne({ short: "maxCardLevel" });
    if (card.level >= foundOption.values[card.card.rarity - 1]) return false;
    return true;
}

async function goldCheck(card, user) {
    let optionName = Object.keys(Card.rarityList)[card.card.rarity] + "UpgradeGoldCost";
    let foundOption = await Option.findOne({ short: optionName })
    if (user.currency.gold < foundOption.values[card.level]) return false
    return true;
}

async function cardsCheck(card, user) {
    let foundOption = await Option.findOne({ short: "upgradeCardCost" })
    let index = user.cards.findIndex(c => c._id == card._id);
    if (user.cards[index].amount < foundOption.values[card.level]) return false;
    return true;
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