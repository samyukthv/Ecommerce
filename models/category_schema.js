const mongoose = require('mongoose'); 
const { array } = require('../multer');

// Declare the Schema of the Mongo model
const Schema = mongoose.Schema;

var categoryschema = new Schema({
    categoryName:{
        type:String,
        required:true,
        
    },
    description:{
        type:String,
        required:true,
    },
    stock:{
        type:String,
        require:true,
    },
    status:{
       type:Boolean,
       required:true,
       default:true,

    },
    image:{
        type:Array,
       
 
     },
    created_at:{
        type:Date,
        default:Date.now()
    }

});



const category= mongoose.model('category',categoryschema);

module.exports=category;