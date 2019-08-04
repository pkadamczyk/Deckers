var roomdata = require('roomdata');

// var User = require("../../models/user");
const DatabaseGame = require("../../models/game");

const ROOMDATA_KEYS = {
    GAME: "GAME",
}
class Player {
    constructor(deck) {
        this.gold = Player.GOLD_ON_START;
        this.health = Player.MAX_HERO_HEALTH;

        this.deck = deck.map(card => ({ ...card, isReady: false }));
        this.currentCard = 0;

        this.cardsOnBoard = []
        this.cardsOnHand = []
    }

    drawCard() {
        let card = this.deck[this.currentCard];
        this.currentCard++;

        this.cardsOnHand.push(card);
        return card;
    }

    summonCard(boardPosition, handPosition) {
        let [summonedCard] = this.cardsOnHand.splice(handPosition, 1);
        this.cardsOnBoard.splice(boardPosition, 0, summonedCard);

        const cost = summonedCard.stats[summonedCard.level].cost;
        this.gold = this.gold - cost;

        return summonedCard;
    }
}

Player.GOLD_ON_START = 1;
Player.MAX_HERO_HEALTH = 10;

class Game {
    constructor(databaseGame) {
        this.players = [];
        this.currentPlayer = 1;
        this.currentRound = 0;
        this.gameId = databaseGame._id;

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

        for (let i = 0; i < cardsOnBoard.length; i++) cardsOnBoard[i].isReady = true;

        const income = Math.ceil(this.currentRound / 2) > 5 ? 5 : Math.ceil(this.currentRound / 2);
        this.players[this.currentPlayer].gold += income;
        console.log(income)

        console.log(this);
    }

    handleCardDrawEvent() {
        this.players[this.currentPlayer].gold -= Game.CARD_DRAW_COST;
        return this.players[this.currentPlayer].drawCard()
    }

    handleCardSummonEvent(boardPosition, handPosition) {
        return this.players[this.currentPlayer].summonCard(boardPosition, handPosition)
    }

    handleAttackOnHero(playerMinionId) {
        let { players, currentPlayer } = this;
        let playerCardsOnBoard = players[currentPlayer].cardsOnBoard;
        let attackingMinion = playerCardsOnBoard[playerMinionId];

        if (!attackingMinion.isReady) throw (new Error("This minion is not ready"));
        attackingMinion.isReady = false;

        let enemyHealth = players[+!currentPlayer].health;
        enemyHealth = enemyHealth - attackingMinion.stats[attackingMinion.level].damage;
        players[+!currentPlayer].health = enemyHealth;

        playerCardsOnBoard.splice(playerMinionId, 1, attackingMinion);
    }

    handleAttackOnMinion(playerMinionId, enemyMinionId) {
        let { currentPlayer, players } = this;

        let playerCardsOnBoard = players[currentPlayer].cardsOnBoard;
        let enemyCardsOnBoard = players[+!currentPlayer].cardsOnBoard; // WORKS ONLY ON 2 PLAYERS

        let attackingMinion = { ...playerCardsOnBoard[playerMinionId] };
        let attackedMinion = { ...enemyCardsOnBoard[enemyMinionId] };

        if (!attackingMinion.isReady) throw (new Error("This minion is not ready"));
        attackingMinion.isReady = false;

        attackedMinion.stats[attackedMinion.level].health -= attackingMinion.stats[attackingMinion.level].damage;
        attackingMinion.stats[attackingMinion.level].health -= attackedMinion.stats[attackedMinion.level].damage;

        if (attackedMinion.stats[attackedMinion.level].health <= 0) enemyCardsOnBoard.splice(enemyMinionId, 1);
        else enemyCardsOnBoard[enemyMinionId] = attackedMinion;

        if (attackingMinion.stats[attackingMinion.level].health <= 0) playerCardsOnBoard.splice(playerMinionId, 1);
        else playerCardsOnBoard[playerMinionId] = attackingMinion;
    }
}

Game.PLAYER_AMOUNT = 2;
Game.CARD_DRAW_COST = 1; // SAME VARIABLE ON CLIENT SIDE, CAREFUL WITH MODIFICATIONS


module.exports.connect = function (io) {
    const GAME_IO = io.of('/game');

    //     // https://github.com/socketio/socket.io/blob/318d62/examples/chat/index.js#L36
    //     // https://www.npmjs.com/package/roomdata
    GAME_IO.on('connection', async function (socket) {
        socket.on('join', async function ({ gameId, role }) {
            console.log(`Joined game ${gameId}`)

            roomdata.joinRoom(socket, "game-" + gameId);

            // Setup objects needed for multi
            if (role === 0) {
                const gamePromise = DatabaseGame.findById(gameId);
                foundGame = await gamePromise;

                const game = new Game(foundGame.toObject());
                roomdata.set(socket, ROOMDATA_KEYS.GAME, game);
            }
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

        socket.on('card-summoned', function ({ boardPosition, handPosition }) {
            const game = roomdata.get(socket, ROOMDATA_KEYS.GAME);
            const card = game.handleCardSummonEvent(boardPosition, handPosition)

            // sending to all clients in 'game' room except sender
            socket.to("game-" + game.gameId).emit('enemy-card-summoned', {
                card,
                boardPosition,
                handPosition
            });

            console.log(`Card summoned!`)
        })

        socket.on('minion-attacked', function ({ playerMinionId, enemyMinionId }) {
            const game = roomdata.get(socket, ROOMDATA_KEYS.GAME);
            const result = game.handleAttackEvent(playerMinionId, enemyMinionId);

            // sending to all clients in 'game' room except sender
            socket.to("game-" + game.gameId).emit('enemy-minion-attacked', {
                playerMinionId,
                enemyMinionId,

                result,
            });
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
