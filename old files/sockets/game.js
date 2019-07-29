// var socketio = require('socket.io');
// var roomdata = require('roomdata');

// var User = require("../../models/user");
// var Game = require("../../models/game");

// // game object

// // romeo - player1 object
// // PLAYER_STATS = {
// //     maxMana: 8,
// //     maxHealth: 10,

// //     mana: 8,
// //     health:10,
// //     armor: 0
// // }
// // juliet - player2 object

// // romeoHand - player1 hand
// // hand = {
// //     cardIndexes[],
// //     currentCard
// // }
// // julietHand - player2 hand

// // currentTurn - keep track of turn number
// // currentPlayer - holds current player username



// module.exports.connect = function (io) {
//     var game = io.of('/game');



//     // https://github.com/socketio/socket.io/blob/318d62/examples/chat/index.js#L36
//     // https://www.npmjs.com/package/roomdata
//     game.on('connection', function (socket) {
//         socket.on('join', function (data) {
//             let reconnected = false;
//             roomdata.joinRoom(socket, "game-" + data.gameID);

//             // Set room data, sends back info about reconnect
//             reconnected = setRoomData(data);

//             // Checks if both players are ready to play
//             if (roomdata.get(socket, "romeo") && roomdata.get(socket, "juliet") && !reconnected) {

//                 //  Send signal to start the game, send enemy username
//                 game.in("game-" + roomdata.get(socket, "gameID")).emit('game-ready', {
//                     romeo: roomdata.get(socket, "romeo").username,
//                     juliet: roomdata.get(socket, "juliet").username,
//                     currentPlayer: roomdata.get(socket, "currentPlayer")
//                 });
//             }
//         })

//         socket.on("card-played", function (data) {

//             let player = determinePlayer();

//             // Set reference
//             let playerObject = roomdata.get(socket, player);
//             let playerDeck = playerObject.deck;

//             // Update player hand on server
//             playerObject.hand = data.playerHand;
//             roomdata.set(socket, player, playerObject);

//             // Get card details
//             let card = playerDeck[data.cardIndex].card;

//             // Send to players
//             game.in("game-" + roomdata.get(socket, "gameID")).emit('card-played', {
//                 card: card,
//                 currentPlayer: roomdata.get(socket, "currentPlayer")
//             });

//             // Calculate stats
//             calculateStats(card);
//         })

//         socket.on("end-turn", function (data) {
//             let currentPlayer = (data.currentPlayer + 1) % 2;
//             // Set room variable to hold current player
//             roomdata.set(socket, "currentPlayer", currentPlayer);

//             // Update player mana on server
//             let player = determinePlayer();
//             let playerObject = roomdata.get(socket, player);
//             playerObject.mana = playerObject.maxMana;
//             roomdata.set(socket, player, playerObject);

//             game.in("game-" + roomdata.get(socket, "gameID")).emit('new-round', { currentPlayer: currentPlayer });

//             // Calls clients for report
//             // game.in("game-" + roomdata.get(socket, "gameID")).emit('send-report');


//             // TODO turn and round report (server, later database)
//             // console.log("##### Round Report ##### ");

//             // console.log(currentPlayer + " : [" + roomdata.get(socket, currentPlayer).hand.cards + "] : " + roomdata.get(socket, currentPlayer).hand.currentCard);
//         })

//         // socket.on("turn-report", function(data) {
//         //     let player = determinePlayer();

//         //     // Set room variable to hold current player
//         //     roomdata.set(socket, "currentPlayer", currentPlayer);

//         //     game.in("game-" + roomdata.get(socket, "gameID")).emit('new-round', { currentPlayer: currentPlayer });

//         //     // Calls clients for report
//         //     game.in("game-" + roomdata.get(socket, "gameID")).emit('send-report');


//         //     // TODO turn and round report (server, later database)
//         //     // console.log("##### Round Report ##### ");

//         //     // console.log(currentPlayer + " : [" + roomdata.get(socket, currentPlayer).hand.cards + "] : " + roomdata.get(socket, currentPlayer).hand.currentCard);
//         // })



//         function determinePlayer() {
//             let player;
//             // Find player
//             if (roomdata.get(socket, "currentPlayer") == 0) player = "romeo";
//             else if (roomdata.get(socket, "currentPlayer") == 1) player = "juliet";
//             else console.log("Trouble in getting right player, Determine Player");

//             // console.log("Current player: " + player);
//             return player;
//         }

//         function determineEnemy() {
//             let enemy;
//             // Find enemy 
//             if (roomdata.get(socket, "currentPlayer") == 1) enemy = "romeo";
//             else if (roomdata.get(socket, "currentPlayer") == 0) enemy = "juliet";
//             else console.log("Trouble in getting right player, Determine Enemy");

//             // console.log("Current enemy : " + enemy);
//             return enemy;
//         }

//         function calculateStats(card) {
//             // console.log("==================");
//             // console.log("Calculate stats: ");
//             let player = determinePlayer();
//             let enemy = determineEnemy();

//             let playerObject = roomdata.get(socket, player);
//             let enemyObject = roomdata.get(socket, enemy);

//             //  Substract card mana cost from your mana pool
//             playerObject.mana -= card.stats.cost;
//             // console.log("Mana: " + playerObject.mana);
//             // GameManager.manaCheck()

//             // Adds armor to player armor pool
//             playerObject.armor += card.stats.armor;
//             // console.log("Armor: " + playerObject.armor);

//             // Adds health to player health and check for overflow
//             playerObject.health += card.stats.heal;
//             if (playerObject.health > playerObject.maxHealth) playerObject.health = playerObject.maxHealth;
//             // console.log("Health: " + playerObject.health);

//             let damageToBeDone = card.stats.damage;
//             if (enemyObject.armor >= damageToBeDone) enemyObject.armor -= damageToBeDone;
//             else {
//                 damageToBeDone -= enemyObject.armor;
//                 enemyObject.armor = 0;
//                 enemyObject.health -= damageToBeDone;
//                 if (enemyObject.health <= 0) gameOver();
//             }
//             // console.log("Enemy health: " + enemyObject.health);

//             roomdata.set(socket, player, playerObject);
//             roomdata.set(socket, enemy, enemyObject);
//             // console.log(roomdata.get(socket, player));
//             // console.log(roomdata.get(socket, enemy));
//         }

//         function gameOver(data) {
//             game.in("game-" + roomdata.get(socket, "gameID")).emit('gameover', { winner: roomdata.get(socket, "currentPlayer") });

//             Game.findById(roomdata.get(socket, "gameID")).deepPopulate('players').exec(function (err, foundGame) {
//                 foundGame.isFinished = true;

//                 foundGame.players.forEach(function (player) {
//                     User.findOne({ username: player.username }, function (err, foundUser) {
//                         if (foundUser.username == roomdata.get(socket, determinePlayer().username)) foundUser.currency.gold += 10;
//                         foundUser.inGame = false;
//                         foundUser.save();
//                         console.log("Player " + foundUser.username + " saved after game");
//                     })
//                 })

//                 foundGame.save();
//             })
//         }

//         function setRoomData(data) {
//             if (!roomdata.get(socket, "currentPlayer")) roomdata.set(socket, "currentPlayer", 0);

//             roomdata.set(socket, "gameID", data.gameID);

//             let player;
//             if (data.role == 0) player = "romeo"
//             else player = "juliet"

//             if (!roomdata.get(socket, player)) {
//                 roomdata.set(socket, player, setPlayerObject(data));
//                 console.log(player + " deck saved!");
//             }
//             // Reconnect
//             else {
//                 reconnect(data);
//                 console.log(player + " reconnected!");
//                 return true;
//             }

//             return false;
//         }

//         function setPlayerObject(data) {
//             let player = {
//                 username: data.username,
//                 maxMana: 8,
//                 maxHealth: 10,

//                 mana: 8,
//                 health: 10,
//                 armor: 0,

//                 hand: {
//                     cards: [0, 1, 2, 3, 4],
//                     currentCard: 5
//                 },
//                 deck: data.player.deck
//             }
//             return player;
//         }

//         function reconnect(data) {
//             let player;
//             let enemy;
//             if (roomdata.get(socket, "currentPlayer") == data.role) {
//                 player = roomdata.get(socket, determinePlayer());
//                 enemy = roomdata.get(socket, determineEnemy());
//             }
//             else {
//                 enemy = roomdata.get(socket, determinePlayer());
//                 player = roomdata.get(socket, determineEnemy());
//             }
//             // console.log(roomdata.get(socket, "currentPlayer") + " : " + data.role);

//             // player-reconnect
//             console.log("Current player: " + player.username);
//             game.in("game-" + roomdata.get(socket, "gameID")).emit('player-reconnect', {
//                 role: data.role,
//                 player: player,
//                 enemy: enemy,
//                 currentPlayer: roomdata.get(socket, "currentPlayer")
//             });
//         }
//     })


//     return io
// }
