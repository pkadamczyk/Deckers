const UserModel = require("../../../models/user");
const CardModel = require("../../../models/card");

const Card = require("./Card");
const Player = require("./Player");
const Effect = require("./Effect");
const EffectManager = require("./EffectManager");
const config = require("./gameConfig")

class Game {
    constructor(databaseGame) {
        this.gameId = databaseGame._id;
        this.playersIdArray = databaseGame.players.map(player => player.user);

        this.players = [];
        this.currentPlayer = 1;
        this.currentRound = 1;

        this.players = databaseGame.players.map(player => new Player(player.deck));
        this.effectManager = new EffectManager(this)

        CardModel.find({}).then(res => this.cardList = res)
    }

    handleAttackEvent(playerMinionId, enemyMinionId) {
        if (enemyMinionId === null) this.handleAttackOnHero(playerMinionId)
        else this.handleAttackOnMinion(playerMinionId, enemyMinionId);

        const result = this.players.map(player => ({ cardsOnBoard: player.cardsOnBoard, health: player.health }))
        return result
    }

    handleEndTurnEvent() {
        this.currentPlayer = (this.currentPlayer + 1) % config.PLAYER_AMOUNT;
        this.currentRound++;

        this.players[this.currentPlayer].handleEndTurn(this.currentRound)
    }

    handleCardDrawEvent() {
        return this.players[this.currentPlayer].drawCard()
    }

    handleCardSummonEvent(boardPosition, handPosition, target) {
        const card = this.players[this.currentPlayer].summonCard(boardPosition, handPosition)

        const hasOnSummonEffect = card.effects && card.effects.onSummon && card.effects.onSummon.length > 0
        if (hasOnSummonEffect) this.invokeCardEffect(card.effects.onSummon[0], target || null)

        const result = this.players.map(player => ({ cardsOnBoard: player.cardsOnBoard, health: player.health }))
        return { card, result };
    }

    invokeCardEffect(effect, target, reversePlayers = false) {
        this.effectManager.invokeCardEffect(effect, target, reversePlayers)
    }

    handleAttackOnHero(playerMinionId) {
        let { players, currentPlayer } = this;
        let playerCardsOnBoard = players[currentPlayer].cardsOnBoard;
        let attackingMinion = playerCardsOnBoard[playerMinionId];

        if (!attackingMinion.inGame.isReady) throw (new Error("This minion is not ready"));
        attackingMinion.inGame.isReady = false;

        // Move this to Player function?
        players[+!currentPlayer].health -= attackingMinion.inGame.stats.damage;
        if (players[+!currentPlayer].health < 0) players[+!currentPlayer].health = 0;
    }

    handleAttackOnMinion(playerMinionId, enemyMinionId) {
        let { currentPlayer, players } = this;

        let attackingMinion = players[currentPlayer].cardsOnBoard[playerMinionId];
        let attackedMinion = players[+!currentPlayer].cardsOnBoard[enemyMinionId];

        if (!attackingMinion.inGame.isReady) throw (new Error("This minion is not ready"));
        attackingMinion.inGame.isReady = false;

        attackedMinion.inGame.stats.health -= attackingMinion.inGame.stats.damage;
        attackingMinion.inGame.stats.health -= attackedMinion.inGame.stats.damage;

        if (attackedMinion.inGame.stats.health <= 0) {
            players[+!currentPlayer].cardsOnBoard.splice(enemyMinionId, 1)
            const hasEffects = attackedMinion.effects && attackedMinion.effects.finalWords && attackedMinion.effects.finalWords.length > 0

            if (hasEffects) this.invokeCardEffect(attackedMinion.effects.finalWords[0], null, true)
        }
        else players[+!currentPlayer].cardsOnBoard[enemyMinionId] = attackedMinion;

        if (attackingMinion.inGame.stats.health <= 0) {
            players[currentPlayer].cardsOnBoard.splice(playerMinionId, 1);
            const hasEffects = attackingMinion.effects && attackingMinion.effects.finalWords && attackingMinion.effects.finalWords.length > 0

            if (hasEffects) this.invokeCardEffect(attackingMinion.effects.finalWords[0])
        }
        else players[currentPlayer].cardsOnBoard[playerMinionId] = attackingMinion;
    }

    // Checks if frontend data equals backend data
    compareData(data) {
        const { currentRound, currentPlayer, cardsOnBoard, cardsOnHand, enemyCardsOnBoard, enemyCardsOnHand, enemyHeroHealth, playerHeroHealth, enemyHeroGold, playerHeroGold } = data

        if (currentRound !== this.currentRound) {
            console.log("Current round is not equal")
            return false;
        }
        if (currentPlayer !== this.currentPlayer) {
            console.log("Current player is not equal")
            return false;
        }

        if (playerHeroHealth !== this.players[this.currentPlayer].health) {
            console.log("Current player health is not equal")
            return false;
        }
        if (enemyHeroHealth !== this.players[+!this.currentPlayer].health) {
            console.log("Opposite player health is not equal")
            return false;
        }

        if (playerHeroGold !== this.players[this.currentPlayer].gold) {
            console.log("Current player gold is not equal")
            return false;
        }
        if (enemyHeroGold !== this.players[+!this.currentPlayer].gold) {
            console.log("Opposite player gold is not equal " + enemyHeroGold + " : " + this.players[+!this.currentPlayer].gold)
            return false;
        }

        const boardArr = this.players[this.currentPlayer].cardsOnBoard.map((card, i) => Card.compareCards(card, cardsOnBoard[i]))
        if (boardArr.includes(false)) {
            console.log("Current player board is not equal")
            return false;
        }

        const handArr = cardsOnHand.map((card, i) => Card.compareCards(card, this.players[this.currentPlayer].cardsOnHand[card.position]))
        if (handArr.includes(false)) {
            console.log("Current player hand is not equal")
            return false;
        }
        const enemyBoardArr = this.players[+!this.currentPlayer].cardsOnBoard.map((card, i) => Card.compareCards(card, enemyCardsOnBoard[i]))
        if (enemyBoardArr.includes(false)) {
            console.log("Opposite player board is not equal")
            return false;
        }

        if (enemyCardsOnHand.length !== this.players[+!this.currentPlayer].cardsOnHand.length) {
            console.log("Opposite player hand is not equal")
            return false;
        }

        return true;
    }

    checkForGameOver() {
        const deadPlayerIndex = this.players.findIndex(player => player.health <= 0)
        if (deadPlayerIndex !== -1) return true
        return false
    }

    async handleGameOver() {
        try {
            const deadPlayerIndex = this.players.findIndex(player => player.health <= 0)
            const winner = +!deadPlayerIndex

            const usersPromises = this.playersIdArray.map(id => UserModel.findById(id))
            const users = await Promise.all(usersPromises);

            // Rewards hard coded xD
            users[winner].currency.gold += config.WIN_REWARD;
            users[winner].inGame = false;

            users[+!winner].currency.gold += config.LOSE_REWARD;
            users[+!winner].inGame = false;

            await users.map(user => user.save())
            return users.map(usr => ({ gold: usr.currency.gold, id: usr._id })); // Returns only gold amount, no need for more now | id for user identyfication
        } catch (err) {
            console.log(err)
        }
    }

    getStarterCards({ selected, role }) {
        const cardsToSplice = selected === null ? 3 : 4;
        let replacedCard;

        const cards = this.players[role].deck.splice(0, cardsToSplice);
        if (selected !== null) [replacedCard] = cards.splice(selected, 1);

        if (replacedCard) this.players[role].deck.push(replacedCard);

        this.players[role].cardsOnHand = cards;
        return cards;
    }

    getReconnectData() {
        const playersDataArray = this.players.map(player => {
            const { cardsOnBoard, cardsOnHand, health, gold, deck, currentCard } = player
            return {
                cardsOnBoard,
                cardsOnHand,
                health,
                gold,
                cardsLeftInDeck: deck.length - currentCard,
            }
        })

        const data = {
            currentPlayer: this.currentPlayer,
            currentRound: this.currentRound,

            playersDataArray,
        }

        return data
    }
}

module.exports = Game