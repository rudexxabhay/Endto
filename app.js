if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// console.log(process.env);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const path = require("path");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const { listingSchema, reviewSchema } = require("./schema.js")
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
// let MONGO_URL = "mongodb://127.0.0.1:27017/major";
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const listingRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const dbUrl = process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(dbUrl);
}
main().then(() => {
    console.log("connected");
}).catch((err) => {
    console.log(err);
})

///User session create
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24*3600,

})

store.on("error", ()=>{
    console.log("ERROR FROM MONGO SESSION ", err)
})
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    httpOnly: true,
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize()) //password ko use krne se phle initialize karna pdega
app.use(passport.session())// session create krta hai taki user ko baar baar login na karna pde
passport.use(new LocalStrategy(User.authenticate()))//ye batata hai kon si authenti method use kr rhe hum LocalStrategy use 
//use kar rhe hai matlb user name aur password se ab user.authenticate() match krega user and pass are coreect or not
passport.serializeUser(User.serializeUser())//Yeh method Passport ko batata hai ki jab user successfully authenticate ho jaye, toh uska data session mein kaise store hoga.
passport.deserializeUser(User.deserializeUser())//iska use hota he ki hume baar baar na login karna pde




//creating demo user
// app.get("/demouser" , async(req,res)=>{
// let fakeUser = new User({
//   email: "rudexabhay@gmail.com",
//   username: "karansingh",
// });
// let newuser = await User.register(fakeUser, "karan552777");
// res.send(newuser);
// })

//create middleware for flash any ,istake
app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser= req.user;
    next();
})

app.use("/listing", listingRouter);
app.use("/listing/:id/review", reviewsRouter);
app.use("/", userRouter);





//Root path
app.get("/", (req, res) => {
    res.send("Hii, iam root path");
})

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found in this server"));
});

app.use("*", (err, req, res, next) => {
    const { statusCode = 500, message = "somthing went wrong" } = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs", { err });
})
//Connection build
app.listen(3000, () => {
    console.log("Server is listing port");
})