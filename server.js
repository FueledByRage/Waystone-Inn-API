const serverRoot = require('./index.js')
const mongoose = require('mongoose')
require('dotenv').config({
    path: __dirname + '/.env'
})
const { DATABASE_USER, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_NAME, API_PORT } = process.env;


//BD
mongoose.connect(`mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:${DATABASE_PORT}/`, { useNewUrlParser: true, useUnifiedTopology: true }).
then(()=>{
    console.log('connected')
}).catch(
    (e)=>{
        console.log( 'Error ' + e + ' has occuried' )
    }
)

serverRoot.http.listen(API_PORT,()=>{
    console.log('running fine')
})