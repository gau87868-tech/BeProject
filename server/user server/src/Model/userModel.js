
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = mongoose.Schema({
    name : {
        type : String,
        required : [true, "Name is Required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters"]
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"]
    },
    password : {
        type : String,
        required : [true,"Password is required"],
        select : false,
        trim : true,
        minlength: [6, "Password must be at least 6 characters"]
    },
    credits : {
        type : Number,
        default : 15,
        min: [0, "Credits cannot be negative"]
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

userModel.pre("save",async function(next){
    if (!this.isModified("password")) return next(); 
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

userModel.methods.comparePassword = async function(userEnteredPassword){
    return await bcrypt.compare(userEnteredPassword,this.password);
}

const User = mongoose.model("User",userModel);
module.exports = User;