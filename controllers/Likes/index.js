const mongoose = require('mongoose');
require('../../models/Post');
const Post = mongoose.model('posts');
const User = mongoose.model('users');
const errorFactory = require('../../utils/errorFactory');
const { decriptToken } = require('../../utils/cryptography');

module.exports = {
    like: async (req, res, cb)=>{
        try {
            const { id } = req.params;
            const token = req.headers.authorization;
            const userId = await decriptToken(token).catch(e => { throw errorFactory(406, 'Authorization error.')} );
            const userLiking = await User.findById(userId);
            const post2Like = await Post.findById(id).select('+listOfUsersWhoLikedIt +listOfUsersWhoDislikedIt');

    
            if(post2Like.listOfUsersWhoDislikedIt.includes(userLiking.user)){
                post2Like.listOfUsersWhoDislikedIt.pull(userLiking.user);
                await Post.updateOne({_id: id}, {$inc: { dislikes: -1 } })
                .catch(e =>{ throw e});
            }

            if(post2Like.listOfUsersWhoLikedIt.includes(userLiking.user)){
                post2Like.listOfUsersWhoLikedIt.pull(userLiking.user);
                await Post.updateOne({_id: id}, {$inc: { likes: -1 } })
                .catch(e =>{ throw e});
                await post2Like.save()
                res.status(200).send();
            }

            post2Like.listOfUsersWhoLikedIt.push(userLiking.user);
            
            await Post.updateOne({_id: id}, {$inc: { likes: 1 } })
            .catch(e =>{ throw e});

            await post2Like.save();
            
            res.status(200).send();
        } catch (error) {
            cb(error)
        }
    },
    dislike: async (req, res, cb)=>{
        try {
            const { id } = req.params;
            const token = req.headers.authorization;
            const userId = await decriptToken(token).catch(e => { throw errorFactory(406, e.message)} );
            const userDisliking = await User.findById(userId);
            const post2Like = await Post.findById(id).select('+listOfUsersWhoLikedIt +listOfUsersWhoDislikedIt');
            
    
            if(post2Like.listOfUsersWhoLikedIt.includes(userDisliking.user)){
                post2Like.listOfUsersWhoLikedIt.pull(userDisliking.user)
                await Post.updateOne({_id: id}, {$inc: { likes: -1 } })
                .catch(e =>{ throw e})
            }
            if(post2Like.listOfUsersWhoDislikedIt.includes(userDisliking.user)){
                post2Like.listOfUsersWhoDislikedIt.pull(userDisliking.user)
                await Post.updateOne({_id: id}, {$inc: { dislikes: -1 } })
                .catch(e =>{ throw e})
                await post2Like.save()
                return res.status(200).send()
            }
            post2Like.listOfUsersWhoDislikedIt.push(userDisliking.user)
            await post2Like.save()
            res.status(200).send()
        } catch (error) {
            cb(error)
        }
    },
}

