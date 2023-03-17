const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
       
    },
    email:{
        type:String,
        required:true,
       
    },
    mobile:{
        type:String,
        required:true,
     
    },
    password:{
        type:String,
        required:true,
    },
    cart:[
        {productid:{type:mongoose.Schema.Types.ObjectId,ref:'product'},
        quantity:{type:Number,default:1},
        total:{type:Number,default:0}

    }

    ],
    wishlist:[
        {
            productdt:{type:mongoose.Schema.Types.ObjectId,ref:'product'}
        }
    ],
    status:{
        type:Boolean,
        default:true
    
    },
    address:[
        {street:{type:String,required:true},
        district:{type:String,required:true},
        state:{type:String,required:true},
        country:{type:String,required:true},
        pincode:{type:Number,required:true}}
    ],
    verify:{
        type:Boolean,
        default:false
    },

    totalbill:{
        type:Number,
        default:0,

    },
    wallet:{
        type:Number,
        default:0
    }

    
});

//Export the model
const user= mongoose.model('User', userSchema);
module.exports=user
