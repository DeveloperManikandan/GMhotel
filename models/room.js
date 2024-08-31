const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    maxcount :{
        type:Number,
        required:true
    },
    phonenumber :{
        type : Number,
        required:false
    },
    rent:{
        type:Number,
        required:true
    },
    images :[],
    currentbookings: {
        type: Array,
        default: [] // Initialize as an empty array
    },
    type : {
        type:String,
        required:true
    },
    description :{
        type:String,
        required:true
    }
},{
    timestamps:true,
})

const roommodel = mongoose.model('rooms',roomSchema)

module.exports = roommodel