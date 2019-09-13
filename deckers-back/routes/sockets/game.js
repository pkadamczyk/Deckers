var roomdata = require('roomdata');

const DatabaseGame = require("../../models/game");
const Game = require("./helpers/Game");

const ROOMDATA_KEYS = {
    GAME: "GAME",
}

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
            console.log(`Joined game as role ${role} : ${gameId}`)
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
            }
            if (role === 1) {
                // Little bit random code, but it makes sure both players join game
                const i = setInterval(() => {
                    if (roomdata.get(socket, ROOMDATA_KEYS.GAME)) {
                        const game = roomdata.get(socket, ROOMDATA_KEYS.GAME);

                        // sending to all clients in 'game' room except sender
                        const player2StarterCards = game.players[role].deck.slice(0, 4);
                        GAME_IO.to(`${socket.id}`).emit('server-ready', { starterCards: player2StarterCards });
                        clearInterval(i)
                    }
                }, 1000);
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
