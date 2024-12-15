const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required: true,
    }
})
//passport-local-mongoose humare liye paasword aur user name create krts hai hume isko
// define krne ki jrut nhi he hum isse apne 
// pass use krne ke liye plugine ka use krna pdta h

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User" , userSchema)