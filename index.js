const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Campground = require("./models/campground");

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


app.listen(3000, () => {
    console.log("Server started on port 3000")
});


app.get("/", async (req, res) => {
    const camps = await Campground.find({});
    res.render("home", { camps });
});

/* app.get("/createCamp", async (req, res) => {
    const camp = new Campground({
        title: "Mazamitla",
        location: "Jalisco",
        price: 43,
        description: "Beautiful woods and amazing weather make for the perfect campsite"
    });
    await camp.save();
    res.send(camp);
}); */



