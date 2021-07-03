const Campground = require("./models/campground");
const { campgroundSchema, reviewSchema } = require("./schemas.js"); //get the validator from Joi from the schema.js file
const ExpressError = require("./utils/ExpressError");//import express Error class
const Review = require("./models/review"); //Review Model



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Must be signed in");
        return res.redirect("/login");
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);

    if (!camp.author.equals(req.user._id)) {
        req.flash("error", "You can't edit or delete a campground that you didn't create");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


module.exports.isReviewOwner = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review.reviewer.equals(req.user._id)) {
        req.flash("error", "You can't edit or delete a review that you didn't create");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

///Validate middleware using Joi
module.exports.validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


//Validate Review middleware using Joi
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}