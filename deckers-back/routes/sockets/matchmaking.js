var socketio = require('socket.io');
var roomdata = require('roomdata');

var User = require("../../models/user");
var Game = require("../../models/game");

module.exports.connect = function(io) {

    //  Matchmaking
    let ROOM_NO = 0;
    let PLAYERS_NUM = 0;
    let gameSearch = io.of('/matchmaking');
    gameSearch.on('connection', function(socket) {
        socket.on('join', function(data) {

            new Promise((resolve, reject) => {
                User.findOne({ username: data.username }, function(err, foundUser) {
                    if (foundUser.inGame) console.log("Player already in game!");
                    else resolve()
                })
            }).then(function() {

                PLAYERS_NUM++;

                console.log('Players looking for game: ' + PLAYERS_NUM);
                if (PLAYERS_NUM % 2 == 1) ROOM_NO++;

                roomdata.joinRoom(socket, "search-" + ROOM_NO);
                roomdata.set(socket, "roomno", ROOM_NO);


                var room = gameSearch.adapter.rooms["search-" + roomdata.get(socket, "roomno")];
                // console.log(room);

                let newGame;
                return new Promise((resolve, reject) => {
                    if (room.length == 1) {
                        newGame = new Game({
                            players: [],
                            isFinished: false
                        });

                        newGame.save(function(err) {
                            roomdata.set(socket, "gameid", newGame._id);
                            resolve();
                        });
                    }
                    else {
                        Game.findById(roomdata.get(socket, "gameid"), function(err, foundGame) {
                            if (err) console.log(err);
                            newGame = foundGame;
                            resolve();
                        })
                    }
                }).then(function() {
                    User.findOne({ username: data.username }, function(err, foundUser) {
                        foundUser.inGame = true;
                        foundUser.currentGame = newGame._id;
                        foundUser.save();

                        newGame.players.push(foundUser._id);
                        newGame.save();

                        if (newGame.players.length == 2) {
                            console.log("Game ready to save");

                            gameSearch.in("search-" + roomdata.get(socket, "roomno")).emit('game-ready', newGame._id);
                            PLAYERS_NUM -= 2;
                        }
                    });
                });
            });
        });

        socket.on('disconnect', function() {
            PLAYERS_NUM--;
            console.log('Players looking for game: ' + PLAYERS_NUM);
        });
    });

    return io
}
