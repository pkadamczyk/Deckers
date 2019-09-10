var roomdata = require('roomdata');

// var User = require("../../models/user");
const DatabaseGame = require("../../models/game");
const UserModel = require("../../models/user");
const CardModel = require("../../models/card");

const ROOMDATA_KEYS = {
    GAME: "GAME",
}

class Card {
    static compareCards(a, b) {
        if (a.level !== b.level) return false;
        if (a.rarity !== b.rarity) return false;
        if (a.race !== b.race) return false;
        if (a.role !== b.role) return false;

        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a.inGame.stats);
        var bProps = Object.getOwnPropertyNames(b.inGame.stats);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName] && propName !== "_id") {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    }
}
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
}

Player.GOLD_ON_START = 1;
Player.MAX_HERO_HEALTH = 10;

class Game {
    constructor(databaseGame) {
        this.gameId = databaseGame._id;
        this.playersIdArray = databaseGame.players.map(player => player.user);

        this.players = [];
        this.currentPlayer = 1;
        this.currentRound = 1;

        this.players = databaseGame.players.map(player => new Player(player.deck));
    }

    handleAttackEvent(playerMinionId, enemyMinionId) {
        if (enemyMinionId === null) this.handleAttackOnHero(playerMinionId)
        else this.handleAttackOnMinion(playerMinionId, enemyMinionId);

        const result = this.players.map(player => ({ cardsOnBoard: player.cardsOnBoard, health: player.health }))
        return result
    }

    handleEndTurnEvent() {
        this.currentPlayer = (this.currentPlayer + 1) % Game.PLAYER_AMOUNT;
        this.currentRound++;

        let cardsOnBoard = this.players[this.currentPlayer].cardsOnBoard;

        for (let i = 0; i < cardsOnBoard.length; i++) cardsOnBoard[i].inGame.isReady = true;

        const income = Math.ceil(this.currentRound / 2) > 5 ? 5 : Math.ceil(this.currentRound / 2);
        this.players[this.currentPlayer].gold += income;
    }

    handleCardDrawEvent() {
        return this.players[this.currentPlayer].drawCard()
    }

    handleCardSummonEvent(boardPosition, handPosition, target) {
        const card = this.players[this.currentPlayer].summonCard(boardPosition, handPosition)
        if (card.effects) this.invokeCardEffect(card.effects.onSummon[0], target || null)

        const result = this.players.map(player => ({ cardsOnBoard: player.cardsOnBoard, health: player.health }))
        return { card, result };
    }

    invokeCardEffect(effect, target) {
        if (effect.effect === CardModel.Effect.EFFECT_LIST.DAMAGE) effect.value = -Math.abs(effect.value);

        if (Object.values(CardModel.Effect.TARGET_LIST.AOE).includes(effect.target)) this.applyEffectAoe(effect)
        else if (target !== null) this.applyEffectToTarget(target, effect)
    }

    applyEffectToTarget(target, effect) {
        const affectedPlayer = target.includes("enemy") ? +!this.currentPlayer : this.currentPlayer

        if (target.includes("portrait")) {
            this.players[affectedPlayer].health += effect.value

            // Handles overheal
            if (this.players[affectedPlayer].health > Player.MAX_HERO_HEALTH)
                this.players[affectedPlayer].health = Player.MAX_HERO_HEALTH
        }
        else if (target.includes("minion")) {
            const minionIndex = +target.slice(-1);
            const newHealth = this.players[affectedPlayer].cardsOnBoard[minionIndex].inGame.stats.health + effect.value

            // Handles overheal
            const level = this.players[affectedPlayer].cardsOnBoard[minionIndex].level;

            if (newHealth > this.players[affectedPlayer].cardsOnBoard[minionIndex].stats[level].health)
                this.players[affectedPlayer].cardsOnBoard[minionIndex].inGame.stats.health = this.players[affectedPlayer].cardsOnBoard[minionIndex].stats[level].health
            else this.players[affectedPlayer].cardsOnBoard[minionIndex].inGame.stats.health = newHealth;

            // Place a null value in minion array if he died
            if (this.players[affectedPlayer].cardsOnBoard[minionIndex].inGame.stats.health <= 0)
                this.players[affectedPlayer].cardsOnBoard[minionIndex] = null

            // Filters out dead minions 
            this.players[affectedPlayer].cardsOnBoard = this.players[affectedPlayer].cardsOnBoard.filter(card => card !== null)
        }

    }

    applyEffectAoe(effect) {
        const { Effect } = CardModel;
        const { TARGET_LIST } = Effect

        const includeEnemyBoard = [TARGET_LIST.AOE.ALL, TARGET_LIST.AOE.ENEMY, TARGET_LIST.AOE.ALL_MINIONS, TARGET_LIST.AOE.ENEMY_MINIONS]
        const includeAllyBoard = [TARGET_LIST.AOE.ALL, TARGET_LIST.AOE.ALLY, TARGET_LIST.AOE.ALL_MINIONS, TARGET_LIST.AOE.ALLY_MINIONS]

        const includeEnemyHero = [TARGET_LIST.AOE.ALL, TARGET_LIST.AOE.ENEMY, TARGET_LIST.ENEMY_HERO]
        const includeAllyHero = [TARGET_LIST.AOE.ALL, TARGET_LIST.AOE.ALLY, TARGET_LIST.ALLY_HERO]

        // Determines whose board should be affected
        let affectedPlayers = [];
        if (includeEnemyBoard.includes(effect.target)) affectedPlayers.push(+!this.currentPlayer)
        if (includeAllyBoard.includes(effect.target)) affectedPlayers.push(this.currentPlayer)

        affectedPlayers.map(player => {
            for (let i = 0; i < this.players[player].cardsOnBoard.length; i++) {
                this.players[player].cardsOnBoard[i].inGame.stats.health += effect.value

                // Handles overheal
                const level = this.players[player].cardsOnBoard[i].level;

                if (this.players[player].cardsOnBoard[i].inGame.stats.health > this.players[player].cardsOnBoard[i].stats[level].health)
                    this.players[player].cardsOnBoard[i].inGame.stats.health = this.players[player].cardsOnBoard[i].stats[level].health

                // Place a null value in minion array if he died
                if (this.players[player].cardsOnBoard[i].inGame.stats.health <= 0) this.players[player].cardsOnBoard[i] = null
            }
            // Filters out dead minions
            this.players[player].cardsOnBoard = this.players[player].cardsOnBoard.filter(card => card !== null)
        })

        // Determines whose hero should be affected
        affectedPlayers = [];
        if (includeEnemyHero.includes(effect.target)) affectedPlayers.push(+!this.currentPlayer)
        if (includeAllyHero.includes(effect.target)) affectedPlayers.push(this.currentPlayer)

        affectedPlayers.map(player => {
            this.players[player].health += effect.value

            // Handles overheal
            if (this.players[player].health > Player.MAX_HERO_HEALTH)
                this.players[player].health = Player.MAX_HERO_HEALTH
        })
    }

    handleAttackOnHero(playerMinionId) {
        let { players, currentPlayer } = this;
        let playerCardsOnBoard = players[currentPlayer].cardsOnBoard;
        let attackingMinion = playerCardsOnBoard[playerMinionId];

        if (!attackingMinion.inGame.isReady) throw (new Error("This minion is not ready"));
        attackingMinion.inGame.isReady = false;

        // Move this to Player function?
        let enemyHealth = players[+!currentPlayer].health;
        enemyHealth = enemyHealth - attackingMinion.inGame.stats.damage;

        players[+!currentPlayer].health = enemyHealth;
    }

    handleAttackOnMinion(playerMinionId, enemyMinionId) {
        let { currentPlayer, players } = this;

        let playerCardsOnBoard = players[currentPlayer].cardsOnBoard;
        let enemyCardsOnBoard = players[+!currentPlayer].cardsOnBoard; // WORKS ONLY ON 2 PLAYERS

        let attackingMinion = { ...playerCardsOnBoard[playerMinionId] };
        let attackedMinion = { ...enemyCardsOnBoard[enemyMinionId] };

        if (!attackingMinion.inGame.isReady) throw (new Error("This minion is not ready"));
        attackingMinion.inGame.isReady = false;

        attackedMinion.inGame.stats.health -= attackingMinion.inGame.stats.damage;
        attackingMinion.inGame.stats.health -= attackedMinion.inGame.stats.damage;

        if (attackedMinion.inGame.stats.health <= 0) enemyCardsOnBoard.splice(enemyMinionId, 1);
        else enemyCardsOnBoard[enemyMinionId] = attackedMinion;

        if (attackingMinion.inGame.stats.health <= 0) playerCardsOnBoard.splice(playerMinionId, 1);
        else playerCardsOnBoard[playerMinionId] = attackingMinion;
    }

    // Checks if frontend data equals backend data
    compareData(data) {
        const { currentRound, currentPlayer, cardsOnBoard, cardsOnHand, enemyCardsOnBoard, enemyCardsOnHand, enemyHeroHealth, playerHeroHealth, enemyHeroGold, playerHeroGold } = data

        if (currentRound !== this.currentRound) return false;
        if (currentPlayer !== this.currentPlayer) return false;

        if (playerHeroHealth !== this.players[this.currentPlayer].health) return false;
        if (enemyHeroHealth !== this.players[+!this.currentPlayer].health) return false;

        if (playerHeroGold !== this.players[this.currentPlayer].gold) return false;
        if (enemyHeroGold !== this.players[+!this.currentPlayer].gold) return false;

        const boardArr = this.players[this.currentPlayer].cardsOnBoard.map((card, i) => Card.compareCards(card, cardsOnBoard[i]))
        if (boardArr.includes(false)) return false;

        const handArr = cardsOnHand.map((card, i) => Card.compareCards(card, this.players[this.currentPlayer].cardsOnHand[card.position]))
        if (handArr.includes(false)) return false;

        const enemyBoardArr = this.players[+!this.currentPlayer].cardsOnBoard.map((card, i) => Card.compareCards(card, enemyCardsOnBoard[i]))
        if (enemyBoardArr.includes(false)) return false;

        if (enemyCardsOnHand.length !== this.players[+!this.currentPlayer].cardsOnHand.length) return false;

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
            users[winner].currency.gold += Game.WIN_REWARD;
            users[winner].inGame = false;

            users[+!winner].currency.gold += Game.LOSE_REWARD;
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

Game.PLAYER_AMOUNT = 2;
Game.CARD_DRAW_COST = 1; // SAME VARIABLE ON CLIENT SIDE, CAREFUL WITH MODIFICATIONS
Game.MAX_CARDS_ON_BOARD = 4; // SAME VARIABLE ON CLIENT SIDE, CAREFUL WITH MODIFICATIONS
Game.MAX_CARDS_ON_HAND = 6; // SAME VARIABLE ON CLIENT SIDE, CAREFUL WITH MODIFICATIONS

Game.WIN_REWARD = 17;
Game.LOSE_REWARD = 9;

module.exports.connect = function (io) {
    const GAME_IO = io.of('/game');

    GAME_IO.on('connection', async function (socket) {
        socket.on('disconnect', function () {
            try {
                console.log('Got disconnect!');
                roomdata.leaveRoom(socket);
            } catch (err) {
                console.log(err)
            }
        });

        socket.on('player-reconnect', function ({ gameId }) {
            console.log(`Reconnected to game ${gameId}`)

            roomdata.joinRoom(socket, "game-" + gameId);
            const game = roomdata.get(socket, ROOMDATA_KEYS.GAME);

            const data = game.getReconnectData();
            // sending to individual socketid (private message)
            GAME_IO.to(`${socket.id}`).emit('player-reconnected', data);
        });

        socket.on('join', async function ({ gameId, role }) {
            console.log(`Joined game ${gameId}`)
            roomdata.joinRoom(socket, "game-" + gameId);

            // Setup objects needed for multi, send ready signal with starting cards
            if (role === 0) {
                const gamePromise = DatabaseGame.findById(gameId);
                foundGame = await gamePromise;

                const game = new Game(foundGame.toObject());
                roomdata.set(socket, ROOMDATA_KEYS.GAME, game);

                // sending to individual socketid (private message)
                const player1StarterCards = game.players[role].deck.slice(0, 4);
                GAME_IO.to(`${socket.id}`).emit('server-ready', { starterCards: player1StarterCards });

                // sending to all clients in 'game' room except sender
                const player2StarterCards = game.players[+!role].deck.slice(0, 4);
                socket.to("game-" + game.gameId).emit('server-ready', { starterCards: player2StarterCards });
            }
        })

        socket.on('pick-starter-cards', function (data) {
            const { role } = data

            const game = roomdata.get(socket, ROOMDATA_KEYS.GAME);
            const player1StarterCards = game.getStarterCards(data);

            if (!game.players.map(p => p.cardsOnHand === null).includes(true)) {
                // sending to individual socketid (private message)
                GAME_IO.to(`${socket.id}`).emit('starter-cards-picked', { starterCards: player1StarterCards });

                const player2StarterCards = game.players[+!role].cardsOnHand;
                // sending to all clients in 'game' room except sender
                socket.to("game-" + game.gameId).emit('starter-cards-picked', { starterCards: player2StarterCards });
            }

        })

        socket.on('data-comparison', function (data) {
            const game = roomdata.get(socket, ROOMDATA_KEYS.GAME);
            const isDataIdentical = game.compareData(data)
            console.log(isDataIdentical);

            // TODO: If compareData returns false, update local data update
        })

        socket.on('turn-ended', function () {
            const game = roomdata.get(socket, ROOMDATA_KEYS.GAME);
            game.handleEndTurnEvent()

            // sending to all clients in 'game' room except sender
            socket.to("game-" + game.gameId).emit('turn-ended', { currentPlayer: game.currentPlayer });
        })

        socket.on('card-drew', function () {
            const game = roomdata.get(socket, ROOMDATA_KEYS.GAME);
            const card = game.handleCardDrawEvent()

            // sending to all clients in 'game' room except sender
            socket.to("game-" + game.gameId).emit('enemy-card-drew', {});

            // sending to individual socketid (private message)
            GAME_IO.to(`${socket.id}`).emit('player-card-drew', { card });

            console.log(`Card drew!`)
        })

        socket.on('card-summoned', async function ({ boardPosition, handPosition, target }) {
            const game = roomdata.get(socket, ROOMDATA_KEYS.GAME);
            const { result, card } = game.handleCardSummonEvent(boardPosition, handPosition, target)

            const isGameOver = game.checkForGameOver()
            if (isGameOver) {
                const usersData = await game.handleGameOver();
                // sending to all clients in 'game' room, including sender
                GAME_IO.in("game-" + game.gameId).emit('user-data-update', { usersData });

                return
            }

            // sending to individual socketid (private message)
            GAME_IO.to(`${socket.id}`).emit('combat-results-comparison', { result });

            socket.to("game-" + game.gameId).emit('enemy-card-summoned', {
                result,
                card,
                handPosition
            });

            console.log(`Card summoned!`)
        })

        socket.on('minion-attacked', async function ({ playerMinionId, enemyMinionId }) {
            const game = roomdata.get(socket, ROOMDATA_KEYS.GAME);
            const result = game.handleAttackEvent(playerMinionId, enemyMinionId);

            const isGameOver = game.checkForGameOver()
            if (isGameOver) {
                const usersData = await game.handleGameOver();
                // sending to all clients in 'game' room, including sender
                GAME_IO.in("game-" + game.gameId).emit('user-data-update', { usersData });

                return
            }

            // sending to all clients in 'game' room except sender
            socket.to("game-" + game.gameId).emit('enemy-minion-attacked', {
                playerMinionId,
                enemyMinionId,

                result,
            });
            // sending to individual socketid (private message)
            GAME_IO.to(`${socket.id}`).emit('combat-results-comparison', { result });

            console.log(`Card attacked`)
        })
        // socket.on("card-played", function (data) {

        //     let player = determinePlayer();

        //     // Set reference
        //     let playerObject = roomdata.get(socket, player);
        //     let playerDeck = playerObject.deck;

        //     // Update player hand on server
        //     playerObject.hand = data.playerHand;
        //     roomdata.set(socket, player, playerObject);

        //     // Get card details
        //     let card = playerDeck[data.cardIndex].card;

        //     // Send to players
        //     game.in("game-" + roomdata.get(socket, "gameID")).emit('card-played', {
        //         card: card,
        //         currentPlayer: roomdata.get(socket, "currentPlayer")
        //     });

        //     // Calculate stats
        //     calculateStats(card);
        // })

        // socket.on("end-turn", function (data) {
        //     let currentPlayer = (data.currentPlayer + 1) % 2;
        //     // Set room variable to hold current player
        //     roomdata.set(socket, "currentPlayer", currentPlayer);

        //     // Update player mana on server
        //     let player = determinePlayer();
        //     let playerObject = roomdata.get(socket, player);
        //     playerObject.mana = playerObject.maxMana;
        //     roomdata.set(socket, player, playerObject);

        //     game.in("game-" + roomdata.get(socket, "gameID")).emit('new-round', { currentPlayer: currentPlayer });

        //     // Calls clients for report
        //     // game.in("game-" + roomdata.get(socket, "gameID")).emit('send-report');


        //     // TODO turn and round report (server, later database)
        //     // console.log("##### Round Report ##### ");

        //     // console.log(currentPlayer + " : [" + roomdata.get(socket, currentPlayer).hand.cards + "] : " + roomdata.get(socket, currentPlayer).hand.currentCard);
        // })

        // socket.on("turn-report", function(data) {
        //     let player = determinePlayer();

        //     // Set room variable to hold current player
        //     roomdata.set(socket, "currentPlayer", currentPlayer);

        //     game.in("game-" + roomdata.get(socket, "gameID")).emit('new-round', { currentPlayer: currentPlayer });

        //     // Calls clients for report
        //     game.in("game-" + roomdata.get(socket, "gameID")).emit('send-report');


        //     // TODO turn and round report (server, later database)
        //     // console.log("##### Round Report ##### ");

        //     // console.log(currentPlayer + " : [" + roomdata.get(socket, currentPlayer).hand.cards + "] : " + roomdata.get(socket, currentPlayer).hand.currentCard);
        // })



        function determinePlayer() {
            let player;
            // Find player
            if (roomdata.get(socket, "currentPlayer") == 0) player = "romeo";
            else if (roomdata.get(socket, "currentPlayer") == 1) player = "juliet";
            else console.log("Trouble in getting right player, Determine Player");

            // console.log("Current player: " + player);
            return player;
        }

        function determineEnemy() {
            let enemy;
            // Find enemy 
            if (roomdata.get(socket, "currentPlayer") == 1) enemy = "romeo";
            else if (roomdata.get(socket, "currentPlayer") == 0) enemy = "juliet";
            else console.log("Trouble in getting right player, Determine Enemy");

            // console.log("Current enemy : " + enemy);
            return enemy;
        }

        function calculateStats(card) {
            // console.log("==================");
            // console.log("Calculate stats: ");
            let player = determinePlayer();
            let enemy = determineEnemy();

            let playerObject = roomdata.get(socket, player);
            let enemyObject = roomdata.get(socket, enemy);

            //  Substract card mana cost from your mana pool
            playerObject.mana -= card.stats.cost;
            // console.log("Mana: " + playerObject.mana);
            // GameManager.manaCheck()

            // Adds armor to player armor pool
            playerObject.armor += card.stats.armor;
            // console.log("Armor: " + playerObject.armor);

            // Adds health to player health and check for overflow
            playerObject.health += card.stats.heal;
            if (playerObject.health > playerObject.maxHealth) playerObject.health = playerObject.maxHealth;
            // console.log("Health: " + playerObject.health);

            let damageToBeDone = card.stats.damage;
            if (enemyObject.armor >= damageToBeDone) enemyObject.armor -= damageToBeDone;
            else {
                damageToBeDone -= enemyObject.armor;
                enemyObject.armor = 0;
                enemyObject.health -= damageToBeDone;
                if (enemyObject.health <= 0) gameOver();
            }
            // console.log("Enemy health: " + enemyObject.health);

            roomdata.set(socket, player, playerObject);
            roomdata.set(socket, enemy, enemyObject);
            // console.log(roomdata.get(socket, player));
            // console.log(roomdata.get(socket, enemy));
        }

        function gameOver(data) {
            game.in("game-" + roomdata.get(socket, "gameID")).emit('gameover', { winner: roomdata.get(socket, "currentPlayer") });

            Game.findById(roomdata.get(socket, "gameID")).deepPopulate('players').exec(function (err, foundGame) {
                foundGame.isFinished = true;

                foundGame.players.forEach(function (player) {
                    User.findOne({ username: player.username }, function (err, foundUser) {
                        if (foundUser.username == roomdata.get(socket, determinePlayer().username)) foundUser.currency.gold += 10;
                        foundUser.inGame = false;
                        foundUser.save();
                        console.log("Player " + foundUser.username + " saved after game");
                    })
                })

                foundGame.save();
            })
        }

        function setRoomData(data) {
            if (!roomdata.get(socket, "currentPlayer")) roomdata.set(socket, "currentPlayer", 0);

            roomdata.set(socket, "gameID", data.gameID);

            let player;
            if (data.role == 0) player = "romeo"
            else player = "juliet"

            if (!roomdata.get(socket, player)) {
                roomdata.set(socket, player, setPlayerObject(data));
                console.log(player + " deck saved!");
            }
            // Reconnect
            else {
                reconnect(data);
                console.log(player + " reconnected!");
                return true;
            }

            return false;
        }

        function setPlayerObject(data) {
            let player = {
                username: data.username,
                maxMana: 8,
                maxHealth: 10,

                mana: 8,
                health: 10,
                armor: 0,

                hand: {
                    cards: [0, 1, 2, 3, 4],
                    currentCard: 5
                },
                deck: data.player.deck
            }
            return player;
        }

        function reconnect(data) {
            let player;
            let enemy;
            if (roomdata.get(socket, "currentPlayer") == data.role) {
                player = roomdata.get(socket, determinePlayer());
                enemy = roomdata.get(socket, determineEnemy());
            }
            else {
                enemy = roomdata.get(socket, determinePlayer());
                player = roomdata.get(socket, determineEnemy());
            }
            // console.log(roomdata.get(socket, "currentPlayer") + " : " + data.role);

            // player-reconnect
            console.log("Current player: " + player.username);
            game.in("game-" + roomdata.get(socket, "gameID")).emit('player-reconnect', {
                role: data.role,
                player: player,
                enemy: enemy,
                currentPlayer: roomdata.get(socket, "currentPlayer")
            });
        }
    })


    return io
}
