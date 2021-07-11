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

//*****check if we are in production or development and only uses the .env file for development purposes */
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}


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
const users = require("./routes/users"); // users routes
const session = require("express-session");//require express session
const flash = require("connect-flash"); // flash package for messages
const passport = require("passport");//Auth package
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const multer = require("multer"); // Multer package to parse enctype multipart/form-data
const upload = multer({ dest: "uploads/" });
const mongoSanitize = require("express-mongo-sanitize");//package to sanitize mongo queries
const helmet = require("helmet");//package to help with http header security
const databaseConnection = process.env.DATABASE_URL || "mongodb://localhost:27017/wecamp";
const MongoStore = require("connect-mongo"); //Package to store session in mongo
const secret = process.env.SECRET || "youneedabettersecretforthefuture";
const port = process.env.PORT || 3000;

// catchAsync() function should wrap our async functions to catch errors
/* HOW TO USE INCLUDES WITH EJS = <%-include("../partials/element")  %> */


//---------------------------------------//
mongoose.set('useFindAndModify', false); //Tell mongoose to not use that function cause is deprecated

//Connect mongoose to mongo database
mongoose.connect(databaseConnection, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    //handle error    
    .then(() => {
        console.log("Mongo connection made")
    })
    .catch(err => {
        console.log("There is an error on mongo")
        console.log(err)
    });



const store = new MongoStore({
    mongoUrl: databaseConnection,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("Session Store Error", e);
});

const sessionConfig = {
    store,
    name: "weCampSession",
    secret, //set secret for the hash should be an enviroment variable
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};


app.use(session(sessionConfig)); // use session for cookies it has to come before passport.session()
app.use(flash()); // use flash
app.use(passport.initialize()); //initialize passport
app.use(passport.session()); //use persistent login sessions
passport.use(new LocalStrategy(User.authenticate())); // method of validation using passport local 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(mongoSanitize()); //Use the mongo sanitizer across the app ****order of app.use matters***
app.use(helmet({ contentSecurityPolicy: false })); //Use helmet package to help with http header security


//flash middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.defaultImg = "https://res.cloudinary.com/del5uarrv/image/upload/v1625802276/WeCamp/empty2_nf1ehf.jpg";
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.engine("ejs", ejsMate); // use ejsMate
app.use(express.urlencoded({ extended: true })); //parse html form data
app.use(express.json()); //parse JSON
app.set("views", path.join(__dirname, "views")); //Tell express where my viewe folder is
app.set("view engine", "ejs"); //Tell express to set ejs as the viewengine
app.use(methodOverride("_method"));//Tell express to use method override
app.use("/campgrounds", campgrounds); //tell app to use the campgrounds routes 
app.use("/campgrounds/:id/reviews", reviews);  //tell app to use the reviews routes
app.use("/", users);
app.use(express.static(path.join(__dirname, "public"))); // path to public directory for static files








//Start Server    
app.listen(port, () => {
    console.log("Server started on port: " + port)
});





//Home route
app.get("/", async (req, res) => {
    const camps = await Campground.find({});
    res.render("campgrounds/home", { camps });
});

//Campground routes ////




//Reviews routes//////////////////////////////////////////////////////////////////////////////



///////////////////// 404 and error routes

//404
app.all("*", (req, res, next) => {
    res.render("404");
    /*/next(new ExpressError("404 Page not found", 404));*/
    next();
})

//error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Internal Server Error" } = err;
    res.locals.title = message;
    res.status(statusCode).render("error", { statusCode, message, err });
})

