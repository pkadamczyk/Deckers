var express = require("express");
var app = express();

var passport = require("passport");
var LocalStrategy = require("passport-local");

var server = require("http").Server(app);
var io = require("socket.io")(server, {});

io = require('./routes/sockets/matchmaking').connect(io);
io = require('./routes/sockets/game').connect(io);

var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var methodOverride = require("method-override");

var roomdata = require('roomdata');

// MODELS IMPORT
var User = require("./models/user");
var Card = require("./models/card");
var Game = require("./models/game");
var OptionGroup = require("./models/optionGroup");

//  ROUTES SETUP
var cardRoutes = require("./routes/cards");
var authRoutes = require("./routes/auth");
var optionRoutes = require("./routes/options");
var shopRoutes = require("./routes/shop");
var chestRoutes = require("./routes/chests");

var profileRoutes = require("./routes/profile");


// //APP CONFIG
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost:27017/deckers", {
    useNewUrlParser: true
});
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

//  PASSPORT CONIG
app.use(require("express-session")({
    secret: "Jebac policje",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware
app.use(function (req, res, next) {
    if (req.user) {
        res.locals.currentUser = req.user;
    }
    next();
});

var isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

//  ROOT ROUTE
app.get("/", function (req, res) {
    res.render("home");
});

// Ajax
// Create new deck
app.post("/decks/update", isLoggedIn, function (req, res) {
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
        console.log(newDeck);
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

app.post("/game/abandon", isLoggedIn, function (req, res) {
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

app.get("/game/:id", isLoggedIn, function (req, res) {
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
server.listen(process.env.PORT, process.env.IP, function () {
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