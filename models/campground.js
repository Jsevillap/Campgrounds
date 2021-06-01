//This is the model of the campground object in our database
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String,
        required: true
    }
});

//export the model so it can be accessed outside this file
module.exports = mongoose.model("Campground", CampgroundSchema);
