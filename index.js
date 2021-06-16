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
const Review = require("./models/review"); //Review Model
const { findByIdAndDelete, findById } = require("./models/campground");
const ejsMate = require("ejs-mate"); // Using ejs-mate for partials main boilerplate layout folder 
const catchAsync = require("./utils/catchAsync"); // import our catchAsync function
const ExpressError = require("./utils/ExpressError");//import express Error class
const { campgroundSchema, reviewSchema } = require("./schemas.js") //get the validator from Joi from the schema.js file
const campgrounds = require("./routes/campgrounds"); //campground routes
const reviews = require("./routes/reviews"); //review routes

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
app.use("/campgrounds", campgrounds); //tell app to use the campgrounds routes 
app.use("/campgrounds/:id/reviews", reviews);  //tell app to use the reviews routes 
app.use(express.static(path.join(__dirname, "public")));



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

//Campground routes ////




//Reviews routes//////////////////////////////////////////////////////////////////////////////



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

