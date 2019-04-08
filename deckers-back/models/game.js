var mongoose = require("mongoose");
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var gameSchema = new mongoose.Schema({
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    isFinished: Boolean
});

gameSchema.plugin(deepPopulate);

module.exports = mongoose.model("Game", gameSchema);
