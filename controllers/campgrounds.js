const Campground = require("../models/campground"); // require the campground Model for my database
const { findById } = require("../models/review");




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

    const { campground: camp } = req.body;
    const newCamp = new Campground(camp);
    newCamp.author = req.user._id;
    await newCamp.save()
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
    await Campground.findByIdAndUpdate(id, camp, { runValidators: true });
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${id}`);


};

module.exports.deleteCamp = async (req, res, next) => {

    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Deleted campground");
    res.redirect("/campgrounds");

};