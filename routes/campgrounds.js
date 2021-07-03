const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");//import express Error class
const Campground = require("../models/campground"); // require the campground Model for my database
const { isLoggedIn, isOwner, validateCampground } = require("../middleware");
const { findById } = require("../models/review");





//index route
router.get("/", async (req, res) => {
    res.locals.title = "WeCamp - Campgrounds";
    const camps = await Campground.find({});
    res.render("campgrounds/index", { camps });
});

//New Route show form to create new camp
router.get("/new", isLoggedIn, (req, res) => {
    res.locals.title = "Create a New Campground";
    res.render("campgrounds/new");
});

//Create Route 
router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {

    const { campground: camp } = req.body;
    const newCamp = new Campground(camp);
    newCamp.author = req.user._id;
    await newCamp.save()
    req.flash("success", "Successfully created a new campground");
    res.redirect(`/campgrounds/${newCamp._id}`);
}));

//Show route
router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({ path: "reviews", populate: { path: "reviewer" } }).populate("author"); //populate to get data from the reference ids
    if (!camp) {
        req.flash("error", "Cannot Find Campground");
        return res.redirect("/campgrounds");
    }
    res.locals.title = camp.title;
    res.render("campgrounds/show", { camp });
}));

//Edit Route //Show edit form
router.get("/:id/edit", isLoggedIn, isOwner, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);

    if (!camp) {
        req.flash("error", "Cannot Find Campground");
        return res.redirect("/campgrounds");
    }
    res.locals.title = `Edit ${camp.title}`; // Define the title of the page based on data from the page
    res.render("campgrounds/edit", { camp })
}));

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateCampground, catchAsync(async (req, res, next) => {

    const { id } = req.params;
    const { campground: camp } = req.body;
    await Campground.findByIdAndUpdate(id, camp, { runValidators: true });
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${id}`);


}));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, catchAsync(async (req, res, next) => {

    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Deleted campground");
    res.redirect("/campgrounds");

}))

module.exports = router;