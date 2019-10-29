const express = require("express");
const router = express.Router();

const { loginRequired, ensureCorrectUser } = require("../middleware/auth");

const Chest = require("../models/chest");
const User = require("../models/user");
const Option = require("../models/option");
const Card = require("../models/card");
const Game = require("../models/game");

const currencyPacks = require("./currencyPacks")


// Route for card upgrade
router.post("/:usr_id/:card_id/upgrade", loginRequired, ensureCorrectUser, async function (req, res, next) {

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
        return next(err);
    }
});

// Route for buying chests
router.post("/:usr_id/shop/buy/:chest", loginRequired, ensureCorrectUser, async function (req, res, next) {
    try {
        let [foundChest, foundUser] = await Promise.all([await Chest.findById(req.params.chest), await User.findById(req.params.usr_id).deepPopulate('cards.card')])

        const cardAmounts = Object.values(foundChest.toObject().cardAmount)

        const currencyType = Object.keys(Chest.currencyList)[foundChest.price.currency]
        if (foundUser.currency[currencyType] < foundChest.price.amount) throw new Error("Not enough currency")
        foundUser.currency[currencyType] -= foundChest.price.amount;

        // Wait for rarity random, then random cards that will be added to player
        cards = await addCardsToArray(cardAmounts);

        let cardIndexes = cards.map(function (cardObj) {
            // Add cards that player didnt have earlier
            if (foundUser.cards.findIndex(card => cardObj.card._id.equals(card.card._id)) === -1) {
                const newCard = { card: cardObj.card._id }
                console.log("New card unlocked: " + cardObj.card.name)
                foundUser.cards.push(newCard);
            }
            return foundUser.cards.findIndex(card => cardObj.card._id.equals(card.card._id))
        })
        cardIndexes.map((cardIndex, i) => foundUser.cards[cardIndex].amount += cards[i].amount);

        await foundUser.deepPopulate('cards.card');

        console.log("Chest bought")
        res.status(200).json({
            newCards: cards,
            currentCards: foundUser.cards,
            currency: foundUser.currency,
        });

        foundUser.save()
    } catch (err) {
        console.log(err)
        return next(err);
    }
});

// Route for buying shop items, currently gold
router.post("/:usr_id/shop/buy/item/:id", loginRequired, ensureCorrectUser, async function (req, res, next) {
    try {
        const user = await User.findById(req.params.usr_id).deepPopulate('cards.card')

        const shopItems = [].concat(currencyPacks.goldPacks).concat(currencyPacks.gemPacks).concat(currencyPacks.testPacks)
        const shopItem = shopItems.find(cp => cp.id == req.params.id)

        const currencyType = Object.keys(Chest.currencyList)[shopItem.price.currency]
        if (user.currency[currencyType] < shopItem.price.amount) throw new Error("Not enough currency")
        user.currency[currencyType] -= shopItem.price.amount;

        // Add whatever user bought
        user.currency[Object.keys(Chest.currencyList)[shopItem.currency]] += shopItem.amount;

        console.log("Item bought")
        res.status(200).json({
            currency: user.currency,
        });

        user.save()
    } catch (err) {
        console.log(err)
        return next(err);
    }
});

// Create new deck
router.post("/:usr_id/decks/create", loginRequired, ensureCorrectUser, async function (req, res, next) {
    try {
        if (req.body.cards.length != 10) throw new Error("Deck should contain 10 cards");

        let newDeck = {
            cards: [],
            name: req.body.name
        };

        const cardsPromise = Card.find({ isFree: true })
        const [foundUser, freeCards] = await Promise.all([fetchUser(req.params.usr_id), cardsPromise])

        const cardsToConcat = freeCards.filter(card => !foundUser.cards.some(c => c.card._id.equals(card._id)))
        const cards = foundUser.cards.concat(cardsToConcat.map(card => ({ level: 1, amount: 0, card })));

        let indexArr = req.body.cards.map(req_card_id => cards.findIndex(usr_card_obj => usr_card_obj.card._id.equals(req_card_id)))

        indexArr.map(index => newDeck.cards.push(cards[index].card._id))

        foundUser.decks.push(newDeck);
        await foundUser.deepPopulate("decks.cards");

        res.status(200).json({
            decks: foundUser.decks,
        });

        foundUser.save();
    } catch (err) {
        console.log(err)
        return next(err);
    }
})

// delete deck 
router.delete("/:usr_id/decks/:deck_id", loginRequired, ensureCorrectUser, async function (req, res, next) {
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
        return next(err);
    }
})

// update deck
router.put("/:usr_id/decks/:deck_id", loginRequired, ensureCorrectUser, async function (req, res, next) {
    try {
        let newDeck = {
            cards: [],
            name: req.body.name
        };

        const cardsPromise = Card.find({ isFree: true })
        const [foundUser, freeCards] = await Promise.all([fetchUser(req.params.usr_id), cardsPromise])

        const cardsToConcat = freeCards.filter(card => !foundUser.cards.some(c => c.card._id.equals(card._id)))
        const cards = foundUser.cards.concat(cardsToConcat.map(card => ({ level: 1, amount: 0, card })));

        let indexArr = req.body.cards.map(req_card_id => cards.findIndex(usr_card_obj => usr_card_obj.card._id.equals(req_card_id)))
        indexArr.map(index => newDeck.cards.push(cards[index].card._id))

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
        return next(err);
    }
})

// Abandon game endpoint
router.post("/:usr_id/game/abandon", loginRequired, ensureCorrectUser, async function (req, res, next) {
    try {
        const user = await User.findById(req.params.usr_id);
        console.log(`${user.username} abandoned game`)

        if (!user.inGame) throw new Error("User is not in game");

        user.inGame = false;
        user.currentGame = null;

        await user.save()

        res.status(200).json({});
    } catch (err) {
        console.log(err)
        return next(err);
    }
})

// Reconnect
router.post("/:usr_id/game/reconnect", loginRequired, ensureCorrectUser, async function (req, res, next) {
    try {
        const userPromise = User.findById(req.params.usr_id).deepPopulate('decks.cards.card');
        const user = await userPromise;
        if (!user.inGame) throw new Error("User is not in game");

        const gamePromise = Game.findById(user.currentGame).deepPopulate('players');
        const foundGame = await gamePromise;
        if (foundGame.isFinished) throw new Error("Game finished");

        const playerIndex = foundGame.players.findIndex(player => player.user._id.equals(user._id))
        if (playerIndex == -1) throw new Error("No such user in game data");

        console.log(`${user.username} is reconnecting`);

        const enemyIndex = foundGame.players.findIndex((p, i) => playerIndex !== i);
        const enemyObject = foundGame.players[enemyIndex];
        const enemyPromise = User.findById(enemyObject.user._id).deepPopulate('decks.cards.card');
        const enemy = await enemyPromise;

        res.status(200).json({
            gameId: foundGame._id,
            player: user.username,
            enemy: enemy.username,

            role: playerIndex,
        });
    } catch (err) {
        console.log(err)
        return next(err);
    }
})

// Join game endpoint
router.post("/:usr_id/game/:game_id", loginRequired, ensureCorrectUser, async function (req, res, next) {
    try {
        const gamePromise = Game.findById(req.params.game_id).deepPopulate('players');
        const userPromise = User.findById(req.params.usr_id).deepPopulate('decks.cards.card');
        const cardListPromise = Card.find({})
        let [foundGame, user, cardList] = await Promise.all([gamePromise, userPromise, cardListPromise]);

        console.log(`Game id: ${req.params.game_id}`)
        if (foundGame.isFinished) throw new Error("Game finished");

        // Sometimes something bugs, give it another try
        if (!user.inGame) {
            await setTimeout(async function () {
                console.log("Bing bong, łapiemy errora")
                user = await User.findById(req.params.usr_id).deepPopulate('decks.cards.card');
                if (!user.inGame) throw new Error("User not in game");
            }, 1000);
        }

        // Handle wrong user sytuation
        const playerIndex = foundGame.players.findIndex(player => player.user._id.equals(user._id))
        if (playerIndex == -1) throw new Error("No such user in game data");

        const enemyIndex = foundGame.players.findIndex((p, i) => playerIndex !== i);
        const enemyObject = foundGame.players[enemyIndex];
        const enemyPromise = User.findById(enemyObject.user._id).deepPopulate('decks.cards.card');
        const enemy = await enemyPromise;

        const enemyDeck = enemy.decks.find(deck => deck._id.toString() === enemyObject.deckId).cards
        const enemyDeckCardsAmount = enemyDeck.length;

        const deckId = user.decks.findIndex(deck => deck._id.equals(req.body.deck_id));
        const userDeck = user.decks[deckId].cards;

        if (playerIndex === 0) {
            const gameDeck = prepareDeck(userDeck, user);

            enemyGameDeck = prepareDeck(enemyDeck, enemy)
            foundGame.players[playerIndex].deck = gameDeck;
            foundGame.players[enemyIndex].deck = enemyGameDeck;

            await foundGame.save();
        }

        res.status(200).json({
            cardList,
            gameId: foundGame._id,
            player: user.username,
            enemy: enemy.username,

            role: playerIndex,
            playerDeckCardsAmount: userDeck.length,
            enemyDeckCardsAmount: enemyDeckCardsAmount
        });
    } catch (err) {
        console.log(err)
        return next(err);
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

function prepareDeck(deck, user) {
    deck = deck.map((card) => {
        foundCardObject = user.cards.find(cardObject => cardObject.card._id.equals(card._id))

        return { ...card.toObject(), level: foundCardObject ? foundCardObject.level : 1 }
    })
    // Shuffle deck
    return shuffle(deck);
}

async function fetchUser(id) {
    try {
        let foundUser = await User.findById(id).deepPopulate('cards.card decks.cards.card');
        return foundUser;
    } catch (err) {
        console.log(err);
    }
}

async function levelCheck(card) {
    try {
        let foundOption = await Option.findOne({ short: "maxCardLevel" });
        if (card.level >= foundOption.values[card.card.rarity - 1]) return false;
        return true;
    } catch (err) {
        console.log(err);
    }
}

async function goldCheck(card, user) {
    try {
        let optionName = Object.keys(Card.rarityList)[card.card.rarity] + "UpgradeGoldCost";
        let foundOption = await Option.findOne({ short: optionName })
        if (user.currency.gold < foundOption.values[card.level]) return false
        return true;
    } catch (err) {
        console.log(err);
    }
}

async function cardsCheck(card, user) {
    try {
        let foundOption = await Option.findOne({ short: "upgradeCardCost" })
        let index = user.cards.findIndex(c => c._id == card._id);
        if (user.cards[index].amount < foundOption.values[card.level]) return false;
        return true;
    } catch (err) {
        console.log(err);
    }
}

async function randomCardsRarity(cardAmounts) {
    try {
        const array = [0, 0, 0, 0];
        const foundOption = await Option.findOne({ short: "randomCardRarity" })
        const max = foundOption.values.reduce((a, b) => a + b, 0);
        const valueArray = foundOption.values;

        for (let i = 0; i < cardAmounts[0]; i++) {
            const random = Math.floor(Math.random() * max);

            const rarity = valueArray.findIndex((el, i, array) => {
                const min = array.slice(0, i).reduce((x, y) => x + y, 0);

                return (random > min && random <= (min + array[i]));
            });

            array[rarity]++;
        }
        return array;
    } catch (err) {
        console.log(err);
    }
}

async function addCardsToArray(cardAmounts) {
    try {
        let cards = [];

        //  Define the rarity of random cards
        const randomedCards = await randomCardsRarity(cardAmounts);

        // Need to skip one as 0 is random cards
        const cardsRarity = cardAmounts.slice(1).map((c, i) => c + randomedCards[i])

        const allCards = await Card.find({ canBeDropped: true })
        const cardDocumentsCount = cardsRarity.map((card, i) => allCards.filter(c => c.rarity === (i + 1)).length)

        cards = cardsRarity.map(function (cardAmount, index) {
            if (cardAmount === 0) return []
            // How much different cards can drop from chests
            const cardSlots = cardAmount > 5 ? 2 : cardAmount > 10 ?
                3 : cardAmount > 20 ?
                    4 : cardAmount > 50 ?
                        5 : 1;

            const array = []
            let count = cardDocumentsCount[index];
            const cardsToPick = allCards.filter(c => c.rarity === (index + 1))

            // Random cards that are allowed to drop
            for (let i = 0; i < cardSlots; i++) {
                const random = Math.floor(Math.random() * count);

                const newCard = cardsToPick[random]
                array.push({ card: newCard, amount: 0 });

                count--;
                cardsToPick.splice(random, 1)
            }

            for (let i = 0; i < cardAmount; i++) {
                const random = Math.floor(Math.random() * cardSlots);
                array[random].amount++;
            }
            return array;
        })

        return cards.reduce((total, amount) => {
            return total.concat(amount);
        }, []);
    } catch (err) {
        console.log(err);
    }
}

module.exports = router;