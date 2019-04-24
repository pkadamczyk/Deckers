var roomdata = require('roomdata');

var User = require("../../models/user");
var Game = require("../../models/game");

module.exports.connect = async function (io) {

    let playersInQueue = 0;
    let Matchmaking = {
        gameMode: [{
            playersInQueue: []
        }]
    }
    let gameSearch = io.of('/matchmaking');

    gameSearch.on('connection', function (socket) {

        socket.on('join', function (data) {
            // needs player id, searched mode(as number)
            try {
                user = await User.findById(data.usr_id);

                if (user.inGame) throw new Error("Player already in game");

                let player = {
                    usr_id: data.usr_id,
                    socket: socket
                }

                Matchmaking.gameMode[data.gameMode].playersInQueue.push(player);
                // console.log('Players looking for game: ' + Matchmaking.playersInQueue.reduce((a, b) => a + b));

                let t = setInterval(teamPlayers, 1000);
                // clearInterval(t);

            } catch (err) {
                console.log(err);
            }
        });

        socket.on('disconnect', function () {
            playersInQueue--;
            console.log('Players looking for game: ' + playersInQueue);
        });
    });

    return io
}

async function teamPlayers() {
    Matchmaking.gameMode.forEach(function (gameMode, i) {
        let pArray = gameMode.playersInQueue.slice();
        try {
            gameMode.playersInQueue.forEach(function (player, i, arr) {
                let p1 = arr[2 * i];
                let p2 = arr[(2 * i) + 1];

                let [user1, user2] = await Promise.all([User.findById(arr[2 * i].usr_id), User.findById(arr[(2 * i) + 1].usr_id)])
                pArray.splice(2 * i, 2)

                // Crate game and add those players to it
                newGame = new Game({
                    players: [],
                    isFinished: false
                });

                newGame.players.push(p1._id, p2._id);
                newGame.save();

                // Modify players inGame variable
                [user1, user2].forEach(function (user) {
                    user.inGame = true;
                    user.currentGame = newGame._id;
                    user.save();
                })

                // Send info about game to players
                let roomName = (Date.now() + Math.random()).toString();
                [p1, p2].forEach(player => player.socket.join(roomName));

                console.log("Game ready to save");
                gameSearch.in(roomName).emit('game-ready', newGame._id);

                [p1, p2].forEach(player => player.socket.leave(roomName));
            })
        } catch (err) {

        }
    })
}












 // if (playersInQueue % 2 == 1) ROOM_NO++;

                // roomdata.joinRoom(socket, "search-" + ROOM_NO);
                // roomdata.set(socket, "roomno", ROOM_NO);

                // Date.now() + Math.random()
                // var room = gameSearch.adapter.rooms["search-" + roomdata.get(socket, "roomno")];
                // console.log(room);

                // let newGame;
                // return new Promise((resolve, reject) => {
                //     if (room.length == 1) {
                //         newGame = new Game({
                //             players: [],
                //             isFinished: false
                //         });

                //         newGame.save(function (err) {
                //             roomdata.set(socket, "gameid", newGame._id);
                //             resolve();
                //         });
                //     }
                //     else {
                //         Game.findById(roomdata.get(socket, "gameid"), function (err, foundGame) {
                //             if (err) console.log(err);
                //             newGame = foundGame;
                //             resolve();
                //         })
                //     }
                // }).then(function () {
                //     User.findOne({ username: data.username }, function (err, foundUser) {
                //         foundUser.inGame = true;
                //         foundUser.currentGame = newGame._id;
                //         foundUser.save();

                //         newGame.players.push(foundUser._id);
                //         newGame.save();

                //         if (newGame.players.length == 2) {
                //             console.log("Game ready to save");

                //             gameSearch.in("search-" + roomdata.get(socket, "roomno")).emit('game-ready', newGame._id);
                //             playersInQueue -= 2;
                //         }
                //     });
                // });