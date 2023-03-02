const { text } = require('body-parser')
const mongoose = require('mongoose')
const { schema } = require('./user_schema')


const Schema= mongoose.Schema

let couponSchema= new Schema({

    couponId:{
        type:String,
        require:true,
        unique:true,
    },
    addDate:{
        type:Date,
        default: Date.now()
    },
    discount:{
        type:String,

    },
    maxLimit:{
     type: Number,
    },
    
    minPurchase:{
        type:Number,
    },
    expDate:{
        type:Date,
        required:true,

    },
    status:{
        type:Boolean,
        default:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',

    }
    
})

const coupon=mongoose.model('coupon',couponSchema)
module.exports=coupon;