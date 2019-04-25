var User = require("../../models/user");
var Game = require("../../models/game");

module.exports.connect = function (io) {

    let Matchmaking = {
        gameMode: [{
            playersInQueue: []
        }]
    }
    let gameSearch = io.of('/matchmaking');

    gameSearch.on('connection', function (socket) {

        socket.on('join', async function (data) {
            // needs player id, searched mode(as number)
            console.log("Player joined");
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

        // TODO
        socket.on('disconnect', function () {
        });
    });

    return io
}

async function teamPlayers() {
    Matchmaking.gameMode.forEach(function (gameMode, i) {
        let pArray = gameMode.playersInQueue.slice();
        try {
            gameMode.playersInQueue.forEach(async function (player, i, arr) {
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
            console.log(err)
        }
    })
}