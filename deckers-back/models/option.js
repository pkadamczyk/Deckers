var mongoose = require("mongoose");

var optionSchema = new mongoose.Schema({
    name: String,
    short: String,

    values: [Number]
});

module.exports = mongoose.model("Option", optionSchema);
