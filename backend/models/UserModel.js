
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true,
    },
    lastName : {
        type : String,
        required : true,
        trim : true,
    },
    gender : {
        type : String,
    },
    dateOfBirth : {
        type : String,
    },
    image : {
        type : String,
    },
    contactNo : {
        type : String,
    },
    email : {
        type : String,
        required : true,
        trim : true,
    },
    password : {
        type : String,
        required : true,
    },
    token : {
        type : String,
    },
})

module.exports = mongoose.model("User" , userSchema);