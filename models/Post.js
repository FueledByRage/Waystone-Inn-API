const mongoose = require('mongoose')
require('dotenv').config({
    path: __dirname + '../.env'
})

const Schema = mongoose.Schema

const Post = new Schema({

    authorId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    fileName:{
        type: String
    },
    communityId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'communities'
    },
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    },
    url: {
        type: String,
    },
    likes:{
        type: Number,
        default: 0
    },
    dislikes:{
        type: Number,
        default: 0
    },
    listOfUsersWhoLikedIt:{
        type: Array,
        select: false,
        default: []
    },
    listOfUsersWhoDislikedIt:{
        type: Array,
        select: false,
        default: []
    }
})

Post.pre('save', function(){
    if(!this.url && this.fileName) this.url = `${process.env.URL}img/${this.fileName}`
})

mongoose.model('posts', Post)