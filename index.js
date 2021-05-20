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
const methodOverride = require("method-override");
const path = require("path");
const Campground = require("./models/campground"); //Model for my database
const { findByIdAndDelete } = require("./models/campground");
const ejsMate = require("ejs-mate"); // Using ejs-mate for partials main boilerplate 


/* HOW TO USE INCLUDES WITH EJS =

<%-include("../partials/element")  %>

*/

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true })); //parse html form data
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

mongoose.set('useFindAndModify', false);

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
app.post("/campgrounds", async (req, res) => {
    res.locals.title = "Create a new camp";
    const camp = req.body;
    const newCamp = new Campground(camp);
    await newCamp.save()
    res.redirect(`/campgrounds/${newCamp._id}`);
});

//Show route
app.get("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.locals.title = camp.title;
    res.render("campgrounds/show", { camp });
});

//Edit Route
app.get("/campgrounds/:id/edit", async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.locals.title = `Edit ${camp.title}`; // Define the title of the page based on data from the page
    res.render("campgrounds/edit", { camp })
});

//Update Route
app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const camp = req.body;
    await Campground.findByIdAndUpdate(id, camp, { runValidators: true });
    res.redirect(`/campgrounds/${id}`);
});

//Delete Route
app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
})



