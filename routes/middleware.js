const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js")
const Review = require("../models/review.js");
//if i usung if function on our like this 0or we create middle wqare and i use multiple times

module.exports.IsLogedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //user laji bhi kisi bhi page se login krega jaise add listing se to 
        //login ke baad user wahi page pr jayega login ke baad bhi
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", " Please login first");
       return res.redirect("/login")
        }
        next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    //agar req.session.redirectUrl hai to usse locals me save kara do
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// middlle ware for check which post u edit u owner or not
module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You are update only own listing")
      return res.redirect(`/listing/${id}`)
    }
    next();
}


module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error)
    } else {
        next();
    }
}
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error)
    } else {
        next();
    }
}


module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You'r delete only own review")
      return res.redirect(`/listing/${id}`)
    }
    next();
}
