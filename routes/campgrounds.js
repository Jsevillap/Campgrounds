const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");//import express Error class
const Campground = require("../models/campground"); // require the campground Model for my database
const { isLoggedIn, isOwner, validateCampground } = require("../middleware");
const { findById } = require("../models/review");
const campgrounds = require("../controllers/campgrounds");

router.route("/")
    .get(catchAsync(campgrounds.index)) //index route
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCamp)); //Create Route 


router.route("/new")
    .get(isLoggedIn, campgrounds.newCamp);//New route show new camp form


router.route("/:id")
    .get(catchAsync(campgrounds.showCamp)) //Show route
    .put(isLoggedIn, isOwner, validateCampground, catchAsync(campgrounds.editCamp)) //edit camp route
    .delete(isLoggedIn, isOwner, catchAsync(campgrounds.deleteCamp)); //delete camp route

router.route("/:id/edit")
    .get(isLoggedIn, isOwner, catchAsync(campgrounds.editCampShow)); //show edit form

//index route old way
//router.get("/", catchAsync(campgrounds.index));

//New Route show form to create new camp
//router.get("/new", isLoggedIn, campgrounds.newCamp);

//Create Route old way
/* router.post("/", isLoggedIn, validateCampground, catchAsync(campgrounds.createCamp)); */

//Show route
//router.get("/:id", catchAsync(campgrounds.showCamp));

//Edit Route //Show edit form
//router.get("/:id/edit", isLoggedIn, isOwner, catchAsync(campgrounds.editCampShow));

//Update Route
//router.put("/:id", isLoggedIn, isOwner, validateCampground, catchAsync(campgrounds.editCamp));

//Delete Route
//router.delete("/:id", isLoggedIn, isOwner, catchAsync(campgrounds.deleteCamp))

module.exports = router;