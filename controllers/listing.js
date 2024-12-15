const Listing = require("../models/listing.js");




module.exports.index = async (req, res, next) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}

module.exports.createNew = (req, res, next) => {
    res.render("listings/new.ejs")
}

module.exports.createdNew = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    console.log(newListing)
    newListing.owner = req.user._id
    newListing.image = {url,filename}
    await newListing.save();
    req.flash("success", "Created successfully..")
    res.redirect("/listing")
}

module.exports.editListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
}

module.exports.updateListing = async (req, res, next) => {
    let { id } = req.params;
   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
   if(typeof req.file !== "undefine"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
   }
    req.flash("success", "Updated")
    res.redirect(`/listing/${id}`)

}
module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author" },
    })
        .populate("owner");
    if (!listing) {
        req.flash("error", "The list you'r access does not exits")
        res.redirect("/listing")
    }
    console.log(listing)
    res.render("listings/show.ejs", { listing })
}

module.exports.deleteListing = async (req, res, next) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id)
    console.log(deleteListing)
    res.redirect("/listing")
}