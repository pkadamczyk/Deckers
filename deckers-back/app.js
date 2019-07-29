require("dotenv").config(); //new auth shit

const express = require("express");
const app = express();
const cors = require("cors"); //new auth shit

const server = require("http").Server(app);
let io = require("socket.io")(server, {});
io = require('./routes/sockets/matchmaking').connect(io);
io = require('./routes/sockets/game').connect(io);

const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const methodOverride = require("method-override");

//  ROUTES SETUP
const cardRoutes = require("./routes/cards");
const authRoutes = require("./routes/auth");
const optionRoutes = require("./routes/options");
const chestRoutes = require("./routes/chests");

const api = require("./api");

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

app.use(function (req, res, next) {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(function errorHandler(error, request, response, next) {
    return response.status(error.status || 500).json({
        error: {
            message: error.message || "Oops! Something went wrong."
        }
    });
});

// SERVER CONFIG
server.listen(8080, process.env.IP, function () {
    console.log("Server started!");
});

