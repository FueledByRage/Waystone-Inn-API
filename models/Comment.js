const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Comment = new Schema({
    authorId:{
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    postId:{
        type: Schema.Types.ObjectId,
        reference: "posts",
        required: true
    },
    comment:{
        type: String,
        required: true
    }

})

mongoose.model('comments', Comment)