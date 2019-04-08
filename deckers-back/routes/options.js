var express = require("express");
var router = express.Router();

// var Card = require("../models/card");
// var User = require("../models/user");
var Option = require("../models/option");
var OptionGroup = require("../models/optionGroup");

// INDEX ROUTE
router.get("/options", function(req, res) {
    // Game.findOne({ _id: req.params.id }).deepPopulate('user1 user2').exec(function(err, foundGame) {
    OptionGroup.find({}).deepPopulate('options.option').exec(function(err, optionGroups) {
        if (err) console.log(err);
        else {
            res.render("options/index", { optionGroups: optionGroups });
        }
    });
});

// CREATE ROUTE
router.post("/options", function(req, res) {
    //new item logic
    // var newCard = req.body.new
    // newCard.stats = req.body.stats;

    OptionGroup.create(req.body.new, function(err, createdOG) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/options");
        }
    })
});

// Create new option and assign it to option group
router.post("/options/:short", function(req, res) {

    Option.create(req.body.new, function(err, createdOption) {
        if (err) {
            console.log(err);
        }
        else {
            OptionGroup.findOne({ short: req.params.short }, function(err, foundOptionGroup) {
                if (err) console.log(err);
                else {
                    // console.log(foundOptionGroup);
                    // Create new option
                    // console.log(createdOption);
                    foundOptionGroup.options.push({ option: createdOption._id });
                    foundOptionGroup.save();

                    // console.log(foundOptionGroup);
                    res.redirect("/options");
                    // Add newly created option to option group
                }
            });


        }
    })


    // Find option group


});

// NEW ROUTE
router.get("/options/new", function(req, res) {
    res.render("options/newOG");
})

router.get("/options/:short/new", function(req, res) {
    res.render("options/new", { OG: req.params.short, });
})

//  EDIT ROUTE
router.get("/options/:id/edit", function(req, res) {

    Option.findById(req.params.id, function(err, foundOption) {
        // console.log("Working");
        if (err) return res.redirect("/options");
        res.render("options/edit", { option: foundOption });
    });
});

// SHOW ROUTE
router.get("/options/:short/:id", function(req, res) {

    Option.findById(req.params.id, function(err, foundOption) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("options/show", { option: foundOption, optionGroup: req.params.short });
        }
    });
});

//  UPDATE ROUTE
router.put("/options/:id", function(req, res) {
    // find and update the correct item
    Option.findByIdAndUpdate(req.params.id, req.body.new, function(err, updatedOption) {
        if (err) {
            res.redirect("/options");
        }
        else {
            //redirect somewhere(show page)
            res.redirect("/options/");
        }
    });
});

//  DESTROY ROUTE
router.delete("/options/:short/:id", function(req, res) {

    OptionGroup.findOne({ short: req.params.short }).deepPopulate('options.option').exec(function(err, foundOptions) {
        if (err) console.log(err);
        else {
            var elementPos = foundOptions.options.map(function(x) {
                return x.option.id;
            }).indexOf(req.params.id);

            var objectFound = foundOptions.options[elementPos];

            foundOptions.options.splice(elementPos, 1);
            foundOptions.save();

            Option.findOneAndDelete(req.params.id, function(err) {
                if (err) res.redirect("/options");
                else res.redirect("/options");
            });
        }
    });
});

router.delete("/options/:short", function(req, res) {
    OptionGroup.findOne({ short: req.params.short }).deleteOne(function(err) {
        if (err) console.log(err);
        res.redirect("/options");
    })
})

module.exports = router;
