var express = require("express");
var router = express.Router();

var Option = require("../models/option");

// INDEX ROUTE
router.get("/options", function (req, res) {
    Option.find({}, function (err, option) {
        if (err) console.log(err);
        else {
            res.render("options/index", { option: option });
        }
    });
});

// CREATE ROUTE
router.post("/options", function (req, res) {
    Option.create(req.body.new, function (err) {
        if (err) console.log(err);
        else res.redirect("/options");
    })
});

// NEW ROUTE
router.get("/options/new", function (req, res) {
    res.render("options/new");
})

// SHOW ROUTE
router.get("/options/:id", function (req, res) {

    Option.findById(req.params.id, function (err, foundOption) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("options/show", { option: foundOption });
        }
    });
});


module.exports = router;
