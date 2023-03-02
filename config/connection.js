const mongoose = require("mongoose");
var express = require('express');
mongoose.set("strictQuery", false);





module.exports={
    connection:()=>{

        try{
            mongoose.connect(process.env.MONGODB_URL)
            console.log("database connected")
        
        }catch(error){
    
            console.log(" db connection failed")
        }
    }
    
}