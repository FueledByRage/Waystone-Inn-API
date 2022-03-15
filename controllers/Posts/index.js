const mongoose = require('mongoose')
require('../../models/Post')
const Post = mongoose.model('posts')
const User = mongoose.model('users')
const Comment = mongoose.model('comments')
const errorFactory = require('../../utils/errorFactory')
const cryptography = require('../../utils/cryptography')
const fs = require('fs')
const { decriptToken } = require('../../utils/cryptography')



module.exports = {
    async register(req, res, cb){
        try {
            const token = req.headers.authorization;
            const { title, body, id } = req.body;
            const { key } = req.file ? req.file : { key: null }

            if(!title || !id || !token ) throw errorFactory(406, 'Missing params.');
            
            
            const authorId = await cryptography.decriptToken(token).catch((error)=>{ 
                throw errorFactory(406, error.message)
            });


            const post = await new Post({
                title: title,
                body: body,
                communityId: id,
                fileName: key || null,
                authorId: authorId
            }).save().catch((error)=>{ throw error })
            return res.status(201).send({_id: post.id});

        } catch (error) {
            cb(error);
        }
    },
    async getPosts(req, res, cb){
        try{
            const token = req.headers.authorization;
            let { page, registers } = req.params;

            const userId = await decriptToken(token).catch(e =>{ throw errorFactory(406, e.message) });

            const userFound = await User.findById(userId)
            .catch(e =>{ throw errorFactory(406, 'Error finding user.')});
            
            if(!userFound) throw errorFactory(406, 'Error finding yours subs');

            const count = await Post.find({ communityId: userFound.subs }).countDocuments().catch((error)=>{
                errorFactory(500, 'Could not find posts.')
            });
            
            //On page 1 no registers will be skiped
            const skip = (parseInt(page) - 1) * parseInt(registers);
            
            const docs = await Post.find({communityId : userFound.subs})
            .skip(skip).limit(parseInt(registers)).populate('communityId').populate('authorId', 'user').
            catch((error)=>{ 
                throw errorFactory(404, 'Could not find posts.')
            });


            res.json({
                docs: docs,
                // To check if there are still any records the number of records skipped 
                //plus the number of records retrieved is subtracted from the total document count, 
                //if the result is 0 or less the last page variable is true
                lastPage: count - (skip + parseInt(registers)) <= 0,
                page: page
            })
    
        }catch(error){
            cb(error)
        }    
    },
    async getPost(req, res, cb){
        try {
            
            const token = req.headers.authorization;
            const { id } = req.params;
            
            const post = await Post.findById(id)
            .select('+listOfUsersWhoLikedIt +listOfUsersWhoDislikedIt')
            .populate('communityId').populate('authorId', 'user').
            catch((error)=>{ 
                throw errorFactory(404, 'Post data not found.')
            });

            if(!post) throw errorFactory(404 , 'Post data not found.');

            //If the user is not logged there is no need to check on likes and dislikes
            if(!token) res.json({post, like: false, dislike: false});

            const userId = await decriptToken(token).catch(e =>{ 
                throw errorFactory(406, 'Authorization error. Please login again.') 
            });

            const userFound = await User.findById(userId)
            .catch(e =>{ throw errorFactory(406, 'Authorization error. Please login again.')});
            
            if(!userFound) res.json({post, like, dislike});

            const like = post.listOfUsersWhoLikedIt.includes(userFound.user);
            const dislike = post.listOfUsersWhoDislikedIt.includes(userFound.user);

            res.json({post, like, dislike});
        } catch (error) {
            cb(error)
        }    

    },
    async getByCommunity(req, res, cb){
        try {
            const { id, page } = req.params 
            
            if(!id || !page ) throw errorFactory(406, 'Missing params.')
            
            const skip = parseInt(page) * 3 - 3
            
            const posts = await Post.find({ communityId: id }).skip(skip).limit(3).populate('authorId', 'user').select('-_id').catch((error)=>{ 
                throw errorFactory(404, 'Error reaching posts.') 
            })
            res.json(posts)

        } catch (error) {
            cb(error)
        }
    },
    async deletePost(req, res, cb){
        try {

            const token = req.headers.authorization;

            const { id } = req.params;

            if(!token) throw errorFactory(406, 'Missing params');
            
            const userId = await cryptography.decriptToken(token).catch((error) => { 
                throw errorFactory(406, error.message);
            });
            const post = await Post.findOne({_id: id}).catch((error) =>{
                throw errorFactory(404, 'Post not found.');
            });

            if(post.authorId == userId){
                const post = await Post.findByIdAndDelete(id).catch((error)=>{ throw errorFactory(500, 'Error deleting posts.') })
                Comment.deleteMany({postId: post._id})
                if(post.url) fs.unlink( `uploads/img/${post.fileName}`).catch((error) =>{
                    throw errorFactory(500, 'Could not delete post data.')
                });
                
            }
            else throw errorFactory(401, 'You have no permition to do this.');

            res.send({id: post.communityId});
        } catch (error) {
            cb(error);
        }
    }
}