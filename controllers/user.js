const User = require("../models/user.js")

module.exports.signUp = (req,res)=>{
    res.render("./users/signup.ejs")
}

module.exports.SignUP = async (req,res)=>{
    try{
        let{email,username,password} = req.body;
        const newUser = new User({email,username})
        const registerUser = await User.register(newUser,password);
        req.login(registerUser,(err)=>{// jab koi user signup krega autometic login ho jayega
            if(err){
                return next(err)
            }
            req.flash("success", "Registered Successfully")
            res.redirect("/listing")
        })
    }catch(e){
        req.flash("error" ,e.message)
        res.redirect("/signup")
    }
  

}

module.exports.renderLogin = (req,res)=>{
    res.render("./users/login.ejs")
}
module.exports.login = async(req,res)=>{
    req.flash("success" , "Welcome back login success")
    let redirectUrl = res.locals.redirectUrl || "/listing"
res.redirect(redirectUrl)
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success" , "You logout successfully");
        res.redirect("/listing")
    })
    }