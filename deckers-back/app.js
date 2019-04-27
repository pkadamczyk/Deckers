require("dotenv").config(); //new auth shit
var express = require("express");
var app = express();
const cors = require("cors"); //new auth shit

var server = require("http").Server(app);
var io = require("socket.io")(server, {});

//ZAKOMENTOWANE BO WYPIERDALA BACKEND - Pszemek
io = require('./routes/sockets/matchmaking').connect(io);
// io = require('./routes/sockets/game').connect(io);

// io.on('connection', function (socket) {
//     console.log("connected")
//     socket.on("join", function () {
//         console.log("player joined")
//     })
// });

var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var methodOverride = require("method-override");

//  ROUTES SETUP
var cardRoutes = require("./routes/cards");
var authRoutes = require("./routes/auth");
var optionRoutes = require("./routes/options");
var chestRoutes = require("./routes/chests");

let api = require("./api");

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

//===============================
//  ROUTES CONNECTIONS TO EXPRESS
app.use(cardRoutes);
app.use(authRoutes);
app.use(optionRoutes);
app.use(chestRoutes);

app.use(api);

// SERVER CONFIG
server.listen(8080, process.env.IP, function () {
    console.log("Server started!");
});

