const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
const Schema = mongoose.Schema;

var productschema = new Schema({
    productName:{
        type:String,
        required:true,
      
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:Array,
        require:true,
    },
    quantity:{
        type:String,
        require:true,
    },
    status:{
       type:Boolean,
       required:true,
       default:true,

    },
    price:{
        type:Number,
        require:true,
    },

    categoryId:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'category',
       required:true

    },
    review:[{
        userName:{type:String},
        message:{type:String},
    }],

    inserted_at:{
        type:Date,
        default:Date.now()
    },
    stock:{
        type:String,
        required:true
    }
});



const product = mongoose.model('product',productschema)
module.exports=product