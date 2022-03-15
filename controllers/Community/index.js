const mongoose = require('mongoose')
require('../../models/Community')
const Community = mongoose.model('communities')
require('../../models/Post')
const Post = mongoose.model('posts')
const { decriptToken } = require('../../utils/cryptography')
const errorFactory = require('../../utils/errorFactory')
require('../../models/User')
const User = mongoose.model('users')

module.exports = {
    async register(req, res, cb){
        try{
        
        const token = req.headers.authorization;
        const { name, description } = req.body;

        if(!token || !name || !description) return res.status(406).send('Missing data!');
    

        const userId = await decriptToken(token).catch((error) => { 
            throw errorFactory(error.message, 406);
        })
    
        const newCommunity = {
            authorId: userId,
            name: name,
            description: description,
        }
    
        const community = await new Community(newCommunity).save().catch((error)=>{ 
            throw errorFactory('Error reaching data.', 404)
        });

        const user = await User.findById(userId).catch((error) => {
            throw errorFactory('Error validating user', 404)
        });
        community.members.push(user.user);
        user.subs.push(community._id.toString());
        await user.save();
        await community.save();

        res.status(201).send({id: community._id});
        
        }catch(error){
            cb(error);
        }
    
    },
    async getCommunity(req, res, cb){
        try {
            const { id } = req.params
         
            const community = await Community.findById(id).populate('authorId', 'user')
             .catch((error)=>{
                 throw errorFactory(404, 'Could not find community.')
             })
            

            if(!community) return res.status(404).send('Community not found.')

             res.json(community)
            
        } catch (error) {
            cb(error)
        }

    },
    async getCommunities(req, res, cb){

        try {
            const token = req.headers.authorization

            if(!token) return res.status(406).send('Missing data on request.')

            const userId = await decriptToken(token).catch((error)=>{ throw errorFactory(error.message, 406) })
            const user = await User.findById(userId).catch((error) => { throw errorFactory(404, 'Error validating user.') })
            const docs = await Community.find( {'_id' : { $in: user.subs }} ).limit(3)
            .catch((error)=>{ throw errorFactory(404, 'Error finding data.') }) 
            
            res.json(docs)
        } catch (error) {
           cb(error)
        }
    },
    async sub(req, res, cb){

        try {
            const token = req.headers.authorization;
            const { id } = req.params;

            if(!token) return res.status(406).send('Token authorization error');
            
            const userId = await decriptToken(token).catch((error) => { throw errorFactory(406, error.message, ) });
    
            const user = await User.findById(userId)
            .catch((error)=>{ throw errorFactory(404, 'Error getting user.') });

            const community = await Community.findById(id)
            .select('+members').catch((error)=> { throw errorFactory(404, 'Could not find requested community') });
            
            if(!user) throw errorFactory(500, 'User not found.');

            if(!user.subs.includes(community._id)){
                user.subs.push(community._id);
                user.save();
            }else{
                user.subs.splice(user.subs.indexOf(user.user));
                user.save();
            }

            if(!community.members.includes(user.user)){
                community.members.push(user.user);
                community.save();
            }else{
                community.members.splice(community.members.indexOf(user.user));
                community.save();
            }
    
            res.status(200).send();
        } catch (error) {
            cb(error);
        }
    },
    async getCommunityAndPost(req, res, cb){
        try {
            
            const token = req.headers.authorization;
            const { id, page, registers } = req.params;
            
            const userId = await decriptToken(token)
            .catch((error) => { throw errorFactory(406, error.message, ) });
    
            const  userFound  = await User.findById(userId)
            .catch((error)=>{ throw errorFactory(404, 'Error getting user.') });
            
            const count = await Post.find({communityId: id}).countDocuments().catch((error) => {
                throw errorFactory(404,'Could not find posts',)
            });

            const skip = (parseInt(page) - 1) * parseInt(registers);

            const community = await Community.findById(id).populate('authorId', 'user').select('-_id +members')
            .catch((error)=>{throw errorFactory(404, 'Could not find community.')});
            
            
            const posts = await Post.find({communityId: id}).select('+listOfUsersWhoLikedIt +listOfUsersWhoDislikedIt')
            .skip(skip).limit(parseInt(registers)).populate('authorId', 'user')
            .catch((error) => {throw errorFactory(404, 'Error on posts data.',)});

            const lastPage =  count - (skip + parseInt(registers)) <= 0;
            


            if(!token) return res.json({Community: community, posts: posts, lastPage: lastPage, sub: false})
            
            const docs = [];
            posts.forEach(post => {
                const like = post.listOfUsersWhoLikedIt.includes(userFound.user);
                const disliked = post.listOfUsersWhoDislikedIt.includes(userFound.user);
                Reflect.deleteProperty(post, 'listOfUsersWhoLikedIt');
                Reflect.deleteProperty(post, 'listOfUsersWhoDislikedIt');
                post.like = like;
                post.disliked = disliked
                docs.push(post);
            });
            
            const sub = community.members.includes(userFound.user);

            return res.status(200).send({Community: community, posts: docs, lastPage: lastPage, sub: sub});

        } catch (error) {
            cb(error)
        }
            
    },

    async getCommunitiesByParam(req, res){
        const { name } = req.params;

        const response = await Community.find({name: {'$regex': name, '$options' : 'i'}})
        .catch((error)=>{
            res.status(404).send(Error('Error findig data'));
        })

        res.status(200).send({communities: response});
    }
}
