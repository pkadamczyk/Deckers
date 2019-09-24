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
    })


    return io
}
