//This is the model of the campground object in our database
const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
    {
        url: String,
        filename: String
    }
);

ImageSchema.virtual("thumbnail").get(function(){
   return this.url.replace("upload/", "upload/w_100/")
});

ImageSchema.virtual("mainPhoto").get(function(){
    return this.url.replace("upload/", "upload/c_fill,h_300,w_500/")
});

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
    images: [ImageSchema],
    reviews: [{
        type: Schema.Types.ObjectId, //this is a mongoose method that references an id to the review model 
        ref: "Review" //reference
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});


//middleware

CampgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })

    }
})

//export the model so it can be accessed outside this file
module.exports = mongoose.model("Campground", CampgroundSchema);
