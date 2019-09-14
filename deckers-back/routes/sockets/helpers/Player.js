const Game = require("./Game");
const CardModel = require("../../../models/card");

class Player {
    constructor(deck) {
        this.gold = Player.GOLD_ON_START;
        this.health = Player.MAX_HERO_HEALTH;

        this.deck = deck.map(card => ({ ...card, inGame: { stats: card.stats[card.level - 1], isReady: false } }));
        this.currentCard = 0;

        this.cardsOnBoard = []
        this.cardsOnHand = null
    }

    drawCard() {
        if (this.gold < Game.CARD_DRAW_COST) throw new Error("Not enough gold");
        if (this.currentCard >= this.deck.length) throw new Error("End of cards");
        if (this.cardsOnHand.length >= Game.MAX_CARDS_ON_HAND) throw new Error("Hand is full");

        this.gold -= Game.CARD_DRAW_COST;
        let card = this.deck[this.currentCard];
        this.currentCard++;

        this.cardsOnHand.push(card);
        console.log(card)

        return card;
    }

    summonCard(boardPosition, handPosition) {
        const card = this.cardsOnHand[handPosition];

        if (this.gold < card.inGame.stats.cost) throw new Error("Not enough gold");
        if (this.cardsOnBoard.length >= Game.MAX_CARDS_ON_BOARD) throw new Error("Board is full");

        const [summonedCard] = this.cardsOnHand.splice(handPosition, 1);

        if (summonedCard.role !== CardModel.roleList.spell) this.cardsOnBoard.splice(boardPosition, 0, summonedCard);

        const cost = summonedCard.inGame.stats.cost;
        this.gold = this.gold - cost;

        return summonedCard;
    }

    handleEndTurn(currentRound) {
        // Set all card to be ready to move
        for (let i = 0; i < this.cardsOnBoard.length; i++) this.cardsOnBoard[i].inGame.isReady = true;

        // Add income to current gold
        const income = Math.ceil(currentRound / 2) > 5 ? 5 : Math.ceil(currentRound / 2);
        this.gold += income;
    }
}

Player.GOLD_ON_START = 1;
Player.MAX_HERO_HEALTH = 10;

module.exports = Player