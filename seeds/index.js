//This file is created to fill in the database with dummy information for testing purposes

const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

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


const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const randomNum = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: "60dca931807b8c454490dc77",
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            title: ` ${descriptors[Math.floor(Math.random() * descriptors.length)]} ${places[Math.floor(Math.random() * places.length)]} `,
            price: Math.floor(Math.random() * 85),
            description: `The Best campsite in ${cities[randomNum].city}, ${cities[randomNum].state}.`,
            images: [
                {
                    url: 'https://res.cloudinary.com/del5uarrv/image/upload/v1625714930/WeCamp/rnxi8tbweugljp7ij0re.jpg',
                    filename: 'WeCamp/rnxi8tbweugljp7ij0re'
                },
                {
                    url: 'https://res.cloudinary.com/del5uarrv/image/upload/v1625714931/WeCamp/pcggf0cbfhnijf9a2dnq.jpg',
                    filename: 'WeCamp/pcggf0cbfhnijf9a2dnq'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})