var mongoose = require("mongoose");
var Option = require("./option");
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var optionGroupSchema = new mongoose.Schema({

    name: String,
    short: String,
    description: String,

    options: [{
        option: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Option"
        }
    }]
});

optionGroupSchema.plugin(deepPopulate);

module.exports = mongoose.model("OptionGroup", optionGroupSchema);
