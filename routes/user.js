const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("./middleware.js")
const session = require("express-session");
const userControll = require("../controllers/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/signup",wrapAsync( userControll.signUp ))

router.post("/signup",wrapAsync( userControll.SignUP))

router.get("/login",userControll.renderLogin)

// Hume user ko jaha se login kre wapis lane ke liye saveredirect ko ccsall krna pdega and use krna [pdega]
router.post("/login",saveRedirectUrl,passport.authenticate("local", 
    {failureRedirect: '/login',
     failureFlash:true}), 
     userControll.login

    )
//Crete a route to loout user
router.get("/logout", userControll.logout)

module.exports = router;