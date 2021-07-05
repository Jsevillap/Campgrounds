const Campground = require("../models/campground"); // require the campground Model for my database
const Review = require("../models/review"); //Review Model


module.exports.createReview = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    review.reviewer = req.user._id;
    await review.save();
    await camp.save();
    req.flash("success", "Successfully created a new review");
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/campgrounds/${id}`)
};