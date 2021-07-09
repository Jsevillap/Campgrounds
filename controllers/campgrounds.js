const campground = require("../models/campground");
const Campground = require("../models/campground"); // require the campground Model for my database
const { findById } = require("../models/review");
const { cloudinary } = require("../cloudinary"); //use cloudinary to delete the image from our cloud
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"); //geocoding sdk npm package
const mapboxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken:mapboxToken});



module.exports.index = async (req, res) => {
    res.locals.title = "WeCamp - Campgrounds";
    const camps = await Campground.find({});
    res.render("campgrounds/index", { camps });
};


module.exports.newCamp = (req, res) => {
    res.locals.title = "Create a New Campground";
    res.render("campgrounds/new");
};

module.exports.createCamp = async (req, res, next) => {

    const geoData = await geoCoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send();
    const { campground: camp } = req.body;
    const newCamp = new Campground(camp);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCamp.author = req.user._id;
    await newCamp.save();
    console.log(newCamp);
    req.flash("success", "Successfully created a new campground");
    res.redirect(`/campgrounds/${newCamp._id}`); 
};


module.exports.showCamp = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({ path: "reviews", populate: { path: "reviewer" } }).populate("author"); //populate to get data from the reference ids
    if (!camp) {
        req.flash("error", "Cannot Find Campground");
        return res.redirect("/campgrounds");
    }
    
    res.locals.title = camp.title;
    res.render("campgrounds/show", { camp });
};


module.exports.editCampShow = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);

    if (!camp) {
        req.flash("error", "Cannot Find Campground");
        return res.redirect("/campgrounds");
    }
    res.locals.title = `Edit ${camp.title}`; // Define the title of the page based on data from the page
    res.render("campgrounds/edit", { camp })
};

module.exports.editCamp = async (req, res, next) => {

    const { id } = req.params;
    const { campground: camp } = req.body;
    const newCamp = await Campground.findByIdAndUpdate(id, camp, { runValidators: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCamp.images.push(...imgs);
    await newCamp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename); //delete image from cloud
        }
        await newCamp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } }); //query to delete images from database based on the selected images from form
    }

    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${id}`);


};

module.exports.deleteCamp = async (req, res, next) => {

    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Deleted campground");
    res.redirect("/campgrounds");

};