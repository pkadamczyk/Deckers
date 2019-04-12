require("dotenv").config(); //new auth shit
var express = require("express");
var app = express();
const cors = require("cors"); //new auth shit

// var passport = require("passport");
// var LocalStrategy = require("passport-local"); new Auth introduced - Pszemek

var server = require("http").Server(app);
var io = require("socket.io")(server, {});

io = require('./routes/sockets/matchmaking').connect(io);
io = require('./routes/sockets/game').connect(io);

var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var methodOverride = require("method-override");

// MODELS IMPORT
var User = require("./models/user");
var Game = require("./models/game");

//  ROUTES SETUP
var cardRoutes = require("./routes/cards");
var authRoutes = require("./routes/auth");
var optionRoutes = require("./routes/options");
var shopRoutes = require("./routes/shop");
var chestRoutes = require("./routes/chests");

var profileRoutes = require("./routes/profile");

//PART OF NEW AUTH - Pszemek
app.use(cors());
app.use(bodyParser.json());

// //APP CONFIG
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb+srv://kamo1234:kamo1234@cluster0-gklst.mongodb.net/deckers?retryWrites=true", {
    useNewUrlParser: true
});
mongoose.Promise = Promise; // DODATKOWY CONFIG PROMISOW MONGOOSA - Pszemek (Auth)
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// Create new deck
app.post("/decks/update", function (req, res) { //isLoggedIn removed, new Auth - Pszemek
    var newDeck = {
        cards: [],
        name: req.body.name
    };
    User.findOne({
        username: req.body.user
    }).deepPopulate('cards.card').exec(function (err, foundUser) {
        if (err) return res.redirect("back");

        for (var i = 0; i < 6; i++) {
            if (!isNaN(req.body.cards[i])) {
                var newCard = {
                    card: foundUser.cards[req.body.cards[i]].card._id
                }
                newDeck.cards.push(newCard);
            }
        }
        console.log("New deck" + newDeck);
        // foundUser.decks.push(newDeck);
        foundUser.decks.splice(0, 1, newDeck);
        foundUser.save();
        // //  Data send to front-end
        // var msg = {
        //     deck: newDeck,
        // }
        // res.send(msg);
    })
})

app.post("/game/abandon", async function (req, res) {//isLoggedIn removed, new Auth - Pszemek
    User.findOne({
        username: req.user.username
    }, function (err, foundUser) {
        if (!foundUser.inGame) console.log("User is not in game!");
        else {
            foundUser.inGame = false;
            foundUser.save(function (err) {
                console.log("Player abandoned game")
                res.send();
            });
        }
    })
})

app.get("/game/:id", function (req, res) {//isLoggedIn removed, new Auth - Pszemek
    Game.findOne({
        _id: req.params.id
    }).deepPopulate('players').exec(function (err, foundGame) {
        if (err) return res.redirect("back");

        // Handle wrong user sytuation
        if (foundGame.players.find(player => player.username == req.user.username) == undefined) {
            console.log("ERROR no such user in game data");
            return res.redirect("back");
        }


        User.findOne({
            username: req.user.username
        }).deepPopulate('decks.cards.card').exec(function (err, foundUser) {
            if (err) return res.redirect("back");

            let gameDeck = [];
            let role;

            for (var i = 0; i < foundUser.decks[0].cards.length; i++) {
                for (var j = 0; j < foundUser.decks[0].cards[i].card.stats.amount; j++) {
                    var newCard = {
                        card: foundUser.decks[0].cards[i].card
                    }
                    gameDeck.push(newCard)
                }
            }

            // Shuffle deck
            gameDeck = shuffle(gameDeck);

            role = foundGame.players.findIndex(player => player.username == req.user.username)
            console.log("Role: " + role);

            res.render("game", {
                player: foundUser,
                role: role,
                deck: gameDeck,
                GAME: foundGame
            });
        });
    });
})

//===============================
//  ROUTES CONNECTIONS TO EXPRESS
app.use(cardRoutes);
app.use(authRoutes);
app.use(optionRoutes);
app.use(shopRoutes);
app.use(chestRoutes);

app.use(profileRoutes);

// SERVER CONFIG
server.listen(8080, process.env.IP, function () {
    console.log("Server started!");
});


// =========================================
function shuffle(array) {
    var m = array.length,
        t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}