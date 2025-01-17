const mongoose = require('mongoose');



const profileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    
    },
    gender:{
        required:true,
        type:String,
        enum:["Male","Female"]

    },
    street: {
        type:String,
        required:true
    
    },
    postalCode: {
        type:String,
        required:true
    
    },
    city: {
        type:String,
        required:true
    
    },
    country: {
        type:String,
        required:true
    
    },


},{timestamps:true});

module.exports =  mongoose.model('profile', profileSchema);