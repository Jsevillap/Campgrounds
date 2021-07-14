const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
        required: true
    }
})


module.exports = mongoose.model("Review", reviewSchema);