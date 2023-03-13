const mongoose= require('mongoose')
const Schema=mongoose.Schema


const bannerSchema=new Schema({
    name:{
        type:String,    
        required:true
    },
    image:{
        type:Array,
        required:true
    },status:{
        type:Boolean,
        required:true,
        default:true
    },
    description:{
        type:String
    }

})


const Banner=mongoose.model("banner",bannerSchema)
module.exports=Banner;