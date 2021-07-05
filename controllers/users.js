const User = require("../models/user");
const passport = require("passport");


module.exports.registerUser = (req, res) => {
    res.locals.title = "Register";
    res.render("users/register")
};


module.exports.createUser = async (req, res) => {

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


};


module.exports.showLogin = (req, res) => {
    res.locals.title = "Login";
    res.render("users/login");
};


module.exports.loginUser = (req, res) => {
    req.flash("success", "Welcome back to WeCamp");
    const redirectURL = req.session.returnTo || "/campgrounds"
    delete req.session.returnTo;
    res.redirect(redirectURL);
};


module.exports.logOutUser = (req, res) => {
    req.logout();
    req.flash("success", "Succesfully logged out");
    res.redirect("/campgrounds");
};