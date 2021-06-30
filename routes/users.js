const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");

router.get("/register", (req, res) => {
    res.locals.title = "Register";
    res.render("users/register")
});

router.post("/register", catchAsync(async (req, res) => {

    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to weCamp");
            res.redirect("/campgrounds");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }


}));

router.get("/login", (req, res) => {
    res.locals.title = "Login";
    res.render("users/login");
});

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "Welcome back to WeCamp");
    const redirectURL = req.session.returnTo || "/campgrounds"
    delete req.session.returnTo;
    res.redirect(redirectURL);
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Succesfully logged out");
    res.redirect("/campgrounds");
});


module.exports = router;