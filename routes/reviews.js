const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");//import express Error class
const Campground = require("../models/campground"); // require the campground Model for my database
const Review = require("../models/review"); //Review Model
const { reviewSchema } = require("../schemas.js") //get the validator from Joi from the schema.js file
const { validateReview, isLoggedIn, isReviewOwner } = require("../middleware");



//Create a review and add it to campground
router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    review.reviewer = req.user._id;
    await review.save();
    await camp.save();
    req.flash("success", "Successfully created a new review");
    res.redirect(`/campgrounds/${id}`);
}));

router.delete("/:reviewId", isLoggedIn, isReviewOwner, catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/campgrounds/${id}`)
}));


module.exports = router;
