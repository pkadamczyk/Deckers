var mongoose = require("mongoose");

var optionSchema = new mongoose.Schema({
    name: String,
    short: String,

    values: []
});

module.exports = mongoose.model("OptionGroup", optionSchema);
