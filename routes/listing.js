const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { IsLogedIn, validateListing, isOwner } = require("./middleware.js")
const listingControll = require("../controllers/listing.js")
//Related to upload image 
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
//index route
router.get("/", wrapAsync(listingControll.index));


//create new listing
router.get("/new", IsLogedIn, wrapAsync(listingControll.createNew));


//create route
router.post("/", IsLogedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingControll.createdNew));


//edit route
router.get("/:id/edit", IsLogedIn, isOwner, wrapAsync(listingControll.editListing));


//update route
router.put("/:id", IsLogedIn, isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingControll.updateListing));


//show route
router.get("/:id", wrapAsync(listingControll.showListing))


//Delete route
router.delete("/:id", IsLogedIn, isOwner, wrapAsync(listingControll.deleteListing))
module.exports = router;