const mongoose = require('mongoose')

const Schema = mongoose.Schema


const Community = new Schema({
    authorId:{
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    name:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    description:{
        type: String,
        required: false
    },
    members:{
        type: Array,
        required: false, 
        select: false,
    }
})

mongoose.model('communities', Community)