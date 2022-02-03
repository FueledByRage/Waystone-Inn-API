const supertest = require('supertest')
const { http } = require('../../index.js')
const mongoose = require('mongoose')

require('dotenv').config({
    path:  '.env'
})

beforeAll(async ()=>{
    const { DATABASE_USER, DATABASE_PASSWORD, DATABASE_PORT } = process.env


    //BD
    mongoose.connect(`mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:${DATABASE_PORT}/`, { useNewUrlParser: true, useUnifiedTopology: true }).
    then(()=>{
        console.log('connected')
    }).catch(
        (e)=>{
            console.log( 'Error ' + e + ' has occuried' )
        }
    )
})

afterAll(()=>{
    mongoose.disconnect()
})

test('Testing the connection', async ()=>{
    const response = await supertest(http).get('/inn/like/d').set({
        authorization: ''
    });

    expect(response.statusCode).toBe(406)
})
