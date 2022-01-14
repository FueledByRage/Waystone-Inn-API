const mongoose = require('mongoose')


    
mongoose.createConnection('mongodb://localhost/inn').
    then(async ()=>{
        console.log('connected')
    }).catch(
        (e)=>{
            console.log( 'Error ' + e + ' has occuried' )
    }
)
        


module.exports = mongoose.connection