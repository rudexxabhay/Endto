const express = require("express");
const router = express.Router({mergeParams:true});
const {listingSchema,reviewSchema} = require("../schema.js")
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, IsLogedIn,isReviewAuthor} = require("../routes/middleware.js")
const reviewControll = require("../controllers/review.js")

//Review route 
router.post("/",IsLogedIn,validateReview,wrapAsync(reviewControll.reviewRoute ));
    
//Delete review route
 router.delete("/:reviewId", IsLogedIn,isReviewAuthor,wrapAsync( reviewControll.deleteReview));

 module.exports=router;