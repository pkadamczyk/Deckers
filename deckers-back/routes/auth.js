//BEFORE PSZEMEK BROKE EVERYTHING

// var express = require("express");
// var router = express.Router();
// var passport = require("passport");

// var User = require("../models/user");
// var Card = require("../models/card");

// //==================================
// // AUTH ROUTES

// //  REGISTER ROUTES
// router.get("/register", function (req, res) {
//     res.render("auth/register");
// });

// //  Handle registration
// router.post("/register", function (req, res) {

//     var newUser = new User({
//         username: req.body.username
//     });
//     User.register(newUser, req.body.password, function (err, user) {
//         if (err) {
//             console.log(err);
//             return res.redirect("/register");
//         }

//         Card.find({
//             cardClass: User.Classes[0]
//         }, function (err, foundCards) {
//             foundCards.forEach(function (card) {
//                 let newCard = {
//                     card: card._id,
//                     amount: 0,
//                     level: 1
//                 }
//                 newUser.cards.push(newCard);
//             })

//             newUser.decks = [];
//             newUser.currency = {
//                 gold: 100,
//                 gems: 0
//             };

//             newUser.save(function (err) {
//                 if (err) return console.log("Register error");
//             });
//             passport.authenticate("local")(req, res, function () {
//                 res.redirect(`/${newUser._id}/profile`);
//             });
//         })


//     });
// });

// // LOGIN ROUTES
// router.get("/login", function (req, res) {
//     res.render("auth/login");
// });

// router.post("/login",
//     passport.authenticate('local', {
//         failureRedirect: '/login'
//     }),
//     function (req, res) {
//         res.redirect('/' + req.user.username);
//     });

// //  LOGOUT ROUTE
// router.get("/logout", function (req, res) {
//     console.log("Logged out!");
//     req.logout();
//     res.redirect("/campgrounds");
// });

// //  Middleware
// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/");
// }

// module.exports = router;


//AFTER PSZEMEK BROKE EVERYTHING

const express = require("express");
const router = express.Router();
var User = require("../models/user");
// var Card = require("../models/card");
const jwt = require("jsonwebtoken");

router.post("/register", async function(req, res, next) {
    try {
      let user = await User.create(req.body);
      let { id, username, profileImageUrl } = user;
      let token = jwt.sign(
        {
          id,
          username,
          profileImageUrl
        },
        process.env.SECRET_KEY
      );
      console.log("NO KURWA DZIALA");
      return res.status(200).json({
        id,
        username,
        profileImageUrl,
        token
      });
    } catch (err) {
      if (err.code === 11000) {
        err.message = "Sorry, that username and/or email is taken";
      }
      return next({
        status: 666,
        message: err.message
      });
    }
  }
);
router.post("/login", async function(req, res, next) {
    // finding a user
    try {
      let user = await User.findOne({
        email: req.body.email
      });
      let { id, username, profileImageUrl } = user;
      let isMatch = await user.comparePassword(req.body.password);
      if (isMatch) {
        let token = jwt.sign(
          {
            id,
            username,
            profileImageUrl
          },
          process.env.SECRET_KEY
        );
        return res.status(200).json({
          id,
          username,
          profileImageUrl,
          token
        });
      } else {
        return next({
          status: 400,
          message: "Invalid Email/Password."
        });
      }
    } catch (e) {
      return next({ status: 400, message: "Invalid Email/Password." });
    }
  }
);

module.exports = router;