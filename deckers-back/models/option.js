var mongoose = require("mongoose");

var optionSchema = new mongoose.Schema({

    name: String,
    short: String,
    description: String,

    value: Number
});

module.exports = mongoose.model("Option", optionSchema);
