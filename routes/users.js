const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/users");


router.route("/register")
    .get(users.registerUser)
    .post(catchAsync(users.createUser));


router.route("/login")
    .get(users.showLogin)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.loginUser);

router.route("/logout")
    .get(users.logOutUser);

// show register form
//router.get("/register", users.registerUser);

//create user and log it in
//router.post("/register", catchAsync(users.createUser));


//show login form
//router.get("/login", users.showLogin);


//Log in user
//router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.loginUser);


//logout user
//router.get("/logout", users.logOutUser);


module.exports = router;