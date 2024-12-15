const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.reviewRoute = async(req,res,next)=>{
    let listing = await Listing.findById(req.params.id)
    let addReview = new Review(req.body.review)
    addReview.author = req.user._id;
    console.log(addReview)
     listing.reviews.push(addReview)
    await addReview.save()
    await listing.save();
    res.redirect(`/listing/${listing.id}`)
    }


    module.exports.deleteReview = async(req,res,next)=>{
         let {id , reviewId} = req.params;
         await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
         await Review.findByIdAndDelete(reviewId);
         req.flash("success" , "Deleted review")
         res.redirect(`/listing/${id}`)
        }