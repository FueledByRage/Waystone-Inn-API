const jwt = require('jsonwebtoken')
require('dotenv').config({
    path: __dirname + '../.env'
})



module.exports ={
    generateToken (params) { 
        return new Promise((resolve, reject) =>{
            try {
                const token = jwt.sign(params, process.env.SECRET_KEY)
                resolve(token)
            } catch (error) {
                reject(error)
            }
        })
    },
    
    async decriptToken(token){
        return new Promise((resolve, reject) =>{
            jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
                if(error) reject(error)
                resolve(decoded.id)
            })
        })
    
    }
}

