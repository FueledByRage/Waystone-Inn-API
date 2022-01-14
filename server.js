const serverRoot = require('./index.js')
const mongoose = require('mongoose')
require('dotenv').config({
    path: __dirname + '/.env'
})

//BD
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).
then(()=>{
    console.log('connected')
}).catch(
    (e)=>{
        console.log( 'Error ' + e + ' has occuried' )
    }
)

serverRoot.http.listen(process.env.PORT,()=>{
    console.log('running fine')
})