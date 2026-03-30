
const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
    companyName : {
        type : String,
        required : [true,"Company Name is Required"],
        trim: true
    },
    role : {
        type : String,
        required : [true,"Role is Required"],
        trim: true
    },
    slug : {
        type : String,
        required : [true,"Slug is Required"],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Company",companySchema);