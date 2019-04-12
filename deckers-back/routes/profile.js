var express = require("express");
var router = express.Router();

var OptionGroup = require("../models/optionGroup");
var User = require("../models/user");
var Card = require("../models/card");

router.get("/:id/cards", async function (req, res) {
    let foundUser = await fetchUser(req.params.id);
    let [maxCardLevel, upgradeCardCost] = await fetchOptionsMany("maxCardLevel", "upgradeCardCost")

    let upgradeGoldCost = await fetchOptionsMany("commonUpgradeGoldCost", "rareUpgradeGoldCost", "epicUpgradeGoldCost",
        "legendaryUpgradeGoldCost");

    res.status(200).json({
        user: foundUser,
        upgradeCardCost: upgradeCardCost,
        upgradeGoldCost: upgradeGoldCost,
        maxCardLevel: maxCardLevel,
    });
})

async function fetchUser(id) {
    let foundUser = await User.findById(id).deepPopulate('cards.card');
    return foundUser;
}

async function fetchOptionsMany() {
    arr = Array.from(arguments);
    arr = await Promise.all(arr.map(value => OptionGroup.findOne({ short: value }).deepPopulate('options.option')))
    return arr;
}

router.get("/:id/play", async function (req, res) {
    let foundUser = await fetchUser(req.params.id);
    res.status(200).json({
        user: foundUser
    });
});

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
    upgradeCardCost = OptionGroup.findOne({ short: "upgradeCardCost" }).deepPopulate('options.option');
    upgradeGoldCost = OptionGroup.findOne({ short: optionName }).deepPopulate('options.option');
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

async function levelCheck(card) {
    return new Promise((resolve, reject) => {
        foundOptionGroup = await OptionGroup.findOne({ short: "maxCardLevel" }).deepPopulate('options.option');
        if (card.level >= foundOptionGroup.options[card.card.rarity - 1].option.value) resolve(false);
        resolve(true);
    })
}

async function goldCheck(card, user) {
    return new Promise((resolve, reject) => {
        let optionName = Object.keys(Card.rarityList)[card.card.rarity] + "UpgradeGoldCost";
        foundOptionGroup = await OptionGroup.findOne({ short: optionName }).deepPopulate('options.option')
        if (user.currency.gold < foundOptionGroup.options[card.level].option.value) resolve(false)
        resolve(true)
    })
}

module.exports = router;