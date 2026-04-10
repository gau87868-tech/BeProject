const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const orgSchema = new mongoose.Schema({
    companyName : {
        type : String,
        required : [true,"Company Name is required"],
        trim: true,
        minlength: [2, "Company name must be at least 2 characters"]
    },
    companyEmail : {
        type : String,
        required : [true,"Company Email is required"],
        unique : [true,"Duplicate Email ! ,Company with this Email has already registered."],
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"]
    },
    password : {
        type : String,
        required : [true, "Password is required"],
        select : false,
        minlength: [6, "Password must be at least 6 characters"]
    },
    contactPerson: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    industry: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},{timestamps : true});


orgSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});


orgSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const OrgModel = mongoose.model("Organization", orgSchema);
module.exports = OrgModel;
