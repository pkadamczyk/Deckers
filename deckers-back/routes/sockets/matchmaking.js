const User = require("../../models/user");
const Game = require("../../models/game");


const Matchmaking = {
    gameMode: [{
        playersInQueue: []
    }]
}
let t = setInterval(teamPlayers, 1000);

module.exports.connect = function (io) {
    // console.log("Player");

    let gameSearch = io.of('/matchmaking');

    gameSearch.on('connection', function (socket) {

        socket.on('join', async function (data) {
            // needs player id, searched mode(as number)
            console.log("Player joined!!");
            try {
                user = await User.findById(data.usr_id);

                if (user.inGame) throw new Error("Player already in game");

                let player = {
                    usr_id: data.usr_id,
                    socket: socket
                }

                // Checks if player isnt already in queue
                if (Matchmaking.gameMode[data.gameMode].playersInQueue.findIndex(pl => pl.usr_id == player.usr_id) != -1) throw new Error("Player already in queue");

                Matchmaking.gameMode[data.gameMode].playersInQueue.push(player);
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
    try {
        Matchmaking.gameMode.forEach(function (gameMode, i) {
            for (let i = 0; i < Math.floor(gameMode.playersInQueue.length / 2); i++) {
                // gameMode.playersInQueue.forEach(async function (player, i, arr) {
                pairPlayers();
            }
        })

    } catch (err) {
        console.log(err)
    }
}

async function pairPlayers() {
    let playerArray = gameMode.playersInQueue.slice();
    let arr = gameMode.playersInQueue;
    try {
        let p1 = arr[2 * i];
        let p2 = arr[(2 * i) + 1];

        let [user1, user2] = await Promise.all([User.findById(arr[2 * i].usr_id), User.findById(arr[(2 * i) + 1].usr_id)]);
        playerArray.splice(2 * i, 2);

        // Crate game and add those players to it
        newGame = new Game({
            players: [],
            isFinished: false
        });

        newGame.players.push(p1.usr_id, p2.usr_id);
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

        console.log("Game ready!");
        gameSearch.in(roomName).emit('game-ready', newGame._id);

        [p1, p2].forEach(player => player.socket.leave(roomName));

        // Saves edited players array to global object
        gameMode.playersInQueue = playerArray;
    } catch (err) {
    }
}