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

const opts = {toJSON:{virtuals:true}};

ImageSchema.virtual("thumbnail").get(function(){
   return this.url.replace("upload/", "upload/w_100/")
}); //creata a mongoose virtual that is basically an extra property on our main object data

ImageSchema.virtual("mainPhoto").get(function(){
    return this.url.replace("upload/", "upload/c_fit,h_600,w_900/")
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
    },
    geometry:{
        type:{
            type: String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    }
}, opts);


CampgroundSchema.virtual("properties.popUpMarkup").get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong> 
    <p> ${this.description.substring(0, 30)}...</p>`
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
