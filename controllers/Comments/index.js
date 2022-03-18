const mongoose = require('mongoose')
require('../../models/Comment')
const Comment = mongoose.model('comments')
const  { decriptToken } = require('../../utils/cryptography')
const errorFactory = require('../../utils/errorFactory')

module.exports = {
    async register(req, res, cb){
        try {
            const token = req.headers.authorization
            const { id: postId, comment } = req.body
    
            if(!token || !postId || !comment) return res.status(406).send('Missing data')

            const authorId = await decriptToken(token).
            catch((error) => { 
                throw errorFactory(406, error.message)
            })
        
            const newComment = await new Comment({
                authorId: authorId,
                postId: postId,
                comment: comment
            }).save().catch((error)=> {
                throw errorFactory(406, 'Error saving comment') 
            })  
            
            res.status(201).json({postId: newComment.postId}) 

        } catch (error) {
            cb(error)
        }
    },
    async getComments(req, res, cb){
        try {
           const { id } = req.params;

           const comments = await Comment.find( { postId: id} ).populate('authorId')
           .catch((error) =>{ 
               throw errorFactory(404, 'Could not find requested data') });

           res.json(comments);
        } catch (error) {
            cb(error);
        }
    },
    async deleteComment(req, res, cb){
        try {
            const token = req.headers.authorization;
            const { id } = req.params;

            if(!token || !id) return res.status(406).send('Missing data.');

            const userId = await decriptToken(token).catch((error) =>{
                throw errorFactory(406, error.message,);
            })
            const author = await Comment.findOne({_id: id}).select('authorId').catch((error)=>{
                throw errorFactory(406, 'Could not find requested data.');
            })
            if(userId == author.authorId) await Comment.findByIdAndDelete(id).catch((error) => { 
                throw errorFactory(500, 'Error deleting comment!');
            })
            else throw errorFactory(500, 'You have no permission to delete this comment!');
            res.send();
        } catch (error) {
            cb(error);
        }
    }
}

