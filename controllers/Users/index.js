const mongoose = require('mongoose')
require('../../models/User')
require('dotenv').config({
    path: __dirname + '../.env'
})
const User = mongoose.model('users')
const cryptography = require('../../utils/cryptography')
const errorFactory = require('../../utils/errorFactory')




module.exports = {
    async register(req, res, cb){
        try {
            const { name, user, email, password } = req.body
            const { key } = req.file ? req.file : { key: null }
            
            if(!name || !user || !email || !password) throw errorFactory(406, 'Missing params.')
            
            const userFound = await User.findOne({email: email})

            if(userFound){
                throw errorFactory(404, 'User already registered.')
            }
            
        const newUser = await new User({
            name,
            user,
            email,
            password,
            profileURL: key ? `${process.env.URL}img/${key}` : null

        }).save().catch((error)=>{ 
            throw errorFactory(500, 'Error registering user.')
        })
        
        const token = await cryptography.generateToken({id: newUser.id}).catch((error) => {
            throw errorFactory(500, error.message)
        })

        const responseJson = { username: newUser.user, token: token, subs: newUser.subs }
        res.status(201).json(responseJson)
        }catch(error){
           cb(error)
        }
    },
    async editProfile(req, res, cb){
        try {
            const token = req.headers.authorization
            const { key } = req.file ? req.file : { key: null } 
    
            if(!token || !key) throw errorFactory(406, 'Missing param.')
    
            const userId = await cryptography.decriptToken(token).catch((error) => { 
                throw errorFactory(406, error.message)
            })
    
            await User.updateOne({_id: userId}, { profileURL: key ? `${process.env.URL}img/profile/${key}` : null }).
            catch((error) =>{ 
                throw errorFactory(500, 'Error updating data')
            })
        
            res.status(200).send()
        } catch (error) {
            cb(error)
        }
    },
    async login(req, res, cb){
        try{ 
        
            const { email, password } = req.body

            if(!email || !password) throw errorFactory(406, 'Missing params.')

            const user = await User.findOne({ email }).select(['-subs'])
            if(!user) { 
                throw errorFactory(404, 'Could not find user.')
            }
     
            if(user.password == password){
                const token = await cryptography.generateToken({id: user._id}).catch((error)=>{
                    throw errorFactory(500, error.message)
                })
        
                const responseJson = {
                    token: token,
                    user: user.user,
                }
        
                res.json(responseJson)
        
            }else{
                throw Error('Authentication error!')
            }
        }catch(error){
            cb(error)
        }
     },
     async getUser(req, res, cb){
        try {
            const { user } = req.params
            const userFound = await User.findOne({
                user: user
            }).select('-_id').catch((error)=>{
                throw errorFactory(404, 'Error finding user.')
            })
            if(!userFound) return res.status(404).send('User not found.')
            res.status(200).json(userFound)
        } catch (error) {
            cb(error)
        }
     }

}