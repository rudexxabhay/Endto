const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash")
app.set("view engine", "ejs");
const path = require("path");
app.set("views", path.join(__dirname, "views"));



// it is compulsory to use
app.use(session({secret: "mysupersecret", resave: false, saveUninitialized:true}))
app.use(flash());
//we creatte a middleware for code not look like bulky
//we access this middkeware code on our ejs page using success errr variable
app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    next();
})

// app.get("/reqcount" , (req,res)=>{
  
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
   
//     res.send(`you send a request ${req.session.count} times`)
// })

app.get("/register",(req,res)=>{
    let {name = "Anynno"} = req.query;
    req.session.name=name;
    if(name === "Anynno"){
        req.flash("success" ,"Success")
    }else{
        req.flash("error", "Not register")
    }
    res.redirect("/hello")
})
app.get("/hello",(req,res)=>{
res.render("flash.ejs", {name:req.session.name})
})

app.listen(3000,()=>{
    console.log("Server started")
})