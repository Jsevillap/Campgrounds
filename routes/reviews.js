const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");//import express Error class
const Campground = require("../models/campground"); // require the campground Model for my database
const Review = require("../models/review"); //Review Model
const { reviewSchema } = require("../schemas.js") //get the validator from Joi from the schema.js file
const { validateReview, isLoggedIn, isReviewOwner } = require("../middleware");
const reviews = require("../controllers/reviews");



//Create a review and add it to campground
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewOwner, catchAsync(reviews.deleteReview));


module.exports = router;
