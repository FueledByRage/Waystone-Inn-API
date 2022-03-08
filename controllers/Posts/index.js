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
            const token = req.headers.authorization
            let { page, nextMod } = req.body
        
            if( !page) throw errorFactory(406, 'Missing Data.')

            const userId = await decriptToken(token).catch(e =>{ throw errorFactory(406, e.message) })

            const userFound = await User.findById(userId).catch(e =>{ throw errorFactory(406, 'Error finding user.')})
            
            if(!userFound) throw errorFactory(406, 'Error finding yours subs')


            const count = await Post.find({ communityId: userFound.subs }).countDocuments().catch((error)=>{
                errorFactory(500, 'Could not find posts.')
            })
            const skip = (parseInt(page) + (parseInt(nextMod))) * 3 - 3
            
        
            const docs = await Post.find({communityId : userFound.subs}).skip(skip).limit(3).populate('communityId').populate('authorId', 'user').
            catch((error)=>{ 
                throw errorFactory(404, 'Could not find posts.')
            })
            
            res.json({
                docs: docs,
                lastPage:  count % 3 == 0 ? count / 3 : 
                Math.round(count / 3) == count / 3 ? (count / 3)+1 : 
                Math.round(count / 3),
                page: page + nextMod
            })
    
        }catch(error){
            cb(error)
        }    
    },
    async getPost(req, res, cb){
        try {
            
            const { id, user } = req.params
            
            if(!id || !user) throw errorFactory(406, 'Missing param.')
            
            const post = await Post.findById(id).select('+listOfUsersWhoLikedIt +listOfUsersWhoDislikedIt')
            .populate('communityId').populate('authorId', 'user').
            catch((error)=>{ 
                throw errorFactory(404, 'Post data not found.')
            })

            if(!post) throw errorFactory(404 , 'Post data not found.')

            const like = user == 'nl' ? false : post.listOfUsersWhoLikedIt.includes(user)
            const dislike = user == 'nl' ? false : post.listOfUsersWhoDislikedIt.includes(user)
            res.json({post, like, dislike})
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

            const token = req.headers.authorization

            const { id } = req.body

            if(!id || !token) throw errorFactory(406, 'Missing params')
            
            const userId = await cryptography.decriptToken(token).catch((error) => { 
                throw errorFactory(406, error.message)
            })
            const post = await Post.findOne({_id: id}).catch((error) =>{
                throw errorFactory(404, 'Post not found.')
            })

            if(post.authorId == userId){
                const post = await Post.findByIdAndDelete(id).catch((error)=>{ throw errorFactory(500, 'Error deleting posts.') })
                Comment.deleteMany({postId: post._id})
                if(post.url) fs.unlink( `uploads/img/${post.fileName}`).catch((error) =>{
                    throw errorFactory(500, 'Could not delete post data.')
                })
                
            }
            else throw errorFactory(401, 'You have no permition to do this.')

            res.status(200).send({id: post.communityId})
        } catch (error) {
            cb(error)
        }
    }
}