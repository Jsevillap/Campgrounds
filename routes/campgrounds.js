const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");//import express Error class
const Campground = require("../models/campground"); // require the campground Model for my database
const Review = require("../models/review"); //Review Model
const { campgroundSchema } = require("../schemas.js") //get the validator from Joi from the schema.js file


///Validate middleware using Joi
const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};



//index route
router.get("/", async (req, res) => {
    res.locals.title = "WeCamp - Campgrounds";
    const camps = await Campground.find({});
    res.render("campgrounds/index", { camps });
});

//New Route show form to create new camp
router.get("/new", (req, res) => {
    res.locals.title = "Create a New Campground";
    res.render("campgrounds/new");
});

//Create Route 
router.post("/", validateCampground, catchAsync(async (req, res, next) => {

    const { campground: camp } = req.body;
    const newCamp = new Campground(camp);
    await newCamp.save()
    req.flash("success", "Successfully created a new campground");
    res.redirect(`/campgrounds/${newCamp._id}`);
}));

//Show route
router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate("reviews"); //populate to get data from the reference ids
    if (!camp) {
        req.flash("error", "Cannot Find Campground");
        return res.redirect("/campgrounds");
    }
    res.locals.title = camp.title;
    res.render("campgrounds/show", { camp });
}));

//Edit Route
router.get("/:id/edit", catchAsync(async (req, res) => {
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
router.put("/:id", validateCampground, catchAsync(async (req, res, next) => {

    const { id } = req.params;
    const { campground: camp } = req.body;
    await Campground.findByIdAndUpdate(id, camp, { runValidators: true });
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${id}`);

}));

//Delete Route
router.delete("/:id", catchAsync(async (req, res, next) => {

    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Deleted campground");
    res.redirect("/campgrounds");

}))

module.exports = router;