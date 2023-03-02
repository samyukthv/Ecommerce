const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
const Schema = mongoose.Schema;

var adminSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
});

//Export the model
const admin = mongoose.model("admin", adminSchema);
module.exports = admin;
