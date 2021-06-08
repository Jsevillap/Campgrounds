/*RESTFUL Routes

CRUD - Create Read Update Delete

Index    /campgrounds             GET     Display all campgrounds
New      /campgrounds/new         GET     Form to create a new campground   
Create   /campgrounds             POST    Creates a new campground
Show     /campgrounds/:id         GET     Shows details for an specific campground
Edit     /campgrounds/:id/edit    GET     Shows Form to edit specific campground
Update   /campgrounds/:id         PATCH   Updates specific campground
Destroy  /campgrounds/:id         DELETE  Deletes Specific campground


*/

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override"); //we need this to be able to use other html verbs on our forms outside of get and post
const path = require("path");
const Campground = require("./models/campground"); // require the campground Model for my database
const { findByIdAndDelete, findById } = require("./models/campground");
const ejsMate = require("ejs-mate"); // Using ejs-mate for partials main boilerplate layout folder 
const catchAsync = require("./utils/catchAsync"); // import our catchAsync function
const ExpressError = require("./utils/ExpressError");//import express Error class
const { campgroundSchema, reviewSchema } = require("./schemas.js") //get the validator from Joi from the schema.js file
const Review = require("./models/review");
// catchAsync() function should wrap our async functions to catch errors

/* HOW TO USE INCLUDES WITH EJS =

<%-include("../partials/element")  %>

*/

app.engine("ejs", ejsMate); // use ejsMate
app.use(express.urlencoded({ extended: true })); //parse html form data
app.use(express.json()); //parse JSON
app.set("views", path.join(__dirname, "views")); //Tell express where my viewe folder is
app.set("view engine", "ejs"); //Tell express to set ejs as the viewengine
app.use(methodOverride("_method"));//Tell express to use method override

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

//Validate Review middleware using Joi
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//---------------------------------------//
mongoose.set('useFindAndModify', false); //Tell mongoose to not use that function cause is deprecated

//Connect mongoose to mongo database
mongoose.connect("mongodb://localhost:27017/wecamp", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    //handle error    
    .then(() => {
        console.log("Mongo connection made")
    })
    .catch(err => {
        console.log("There is an error on mongo")
        console.log(err)
    });


//Start Server    
app.listen(3000, () => {
    console.log("Server started on port 3000")
});

//Home route
app.get("/", async (req, res) => {
    const camps = await Campground.find({});
    res.render("home", { camps });
});


//index route
app.get("/campgrounds", async (req, res) => {
    res.locals.title = "WeCamp - Campgrounds";
    const camps = await Campground.find({});
    res.render("campgrounds/index", { camps });
});

//New Route show form to create new camp
app.get("/campgrounds/new", (req, res) => {
    res.locals.title = "Create a New Campground";
    res.render("campgrounds/new");
});

//Create Route 
app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {
    const { campground: camp } = req.body;
    const newCamp = new Campground(camp);
    await newCamp.save()
    res.redirect(`/campgrounds/${newCamp._id}`);
}));

//Show route
app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate("reviews"); //populate to get data from the reference ids
    res.locals.title = camp.title;
    res.render("campgrounds/show", { camp });
}));

//Edit Route
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.locals.title = `Edit ${camp.title}`; // Define the title of the page based on data from the page
    res.render("campgrounds/edit", { camp })
}));

//Update Route
app.put("/campgrounds/:id", validateCampground, catchAsync(async (req, res, next) => {

    const { id } = req.params;
    const { campground: camp } = req.body;
    await Campground.findByIdAndUpdate(id, camp, { runValidators: true });
    res.redirect(`/campgrounds/${id}`);

}));

//Delete Route
app.delete("/campgrounds/:id", catchAsync(async (req, res, next) => {

    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");

}))


//Reviews routes//////////////////////////////////////////////////////////////////////////////

//Create a review and add it to campground
app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${id}`);
}));

app.delete("/campgrounds/:id/reviews/:reviewId", catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}));


///////////////////// 404 and error routes

//404
app.all("*", (req, res, next) => {
    next(new ExpressError("404 Page not found", 404));
})

//error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Internal Server Error" } = err;
    res.locals.title = message;
    res.status(statusCode).render("error", { statusCode, message, err });
})

