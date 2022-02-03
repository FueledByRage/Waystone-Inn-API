const supertest = require('supertest')
const { http } = require('../../index.js')
const mongoose = require('mongoose')
require('dotenv').config({
    path:  '.env'
})

beforeAll(async ()=>{
    const { DATABASE_USER, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_NAME, API_PORT } = process.env


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

test('POST /inn/comment/register - gotta get an error since there is missing params', async()=>{
    const response = await supertest(http).post('/inn/comment/register').send({
        id: '15',
        comment: '5'
    }).set({
        authorization: ''
    });
    expect(response.statusCode).toBe(406)
})

test('GET /inn/comments/:id - gotta test if the route return a proper error since the id is not valid.',async()=>{
    const response = await supertest(http).get('/inn/comments/12')
    expect(response.statusCode).toBe(404)    
})

test('POST /inn/comment/deleteComment - The request will fail since the token is not defined.', async()=>{
    const response = await supertest(http).post('/inn/comment/deleteComment').send({
        id:'1'
    }).set({
        authorization: undefined
    });
    expect(response.statusCode).toBe(406)
})

test('POST /inn/comment/deleteComment - The request will fail since the token is not from the comment author.', async()=>{
    const response = await supertest(http).post('/inn/comment/deleteComment').send({
        id:'611bb8cab9086b0bd0c03f9c'
    }).set({
        authorization: 'invalid token here'
    });
    expect(response.statusCode).toBe(406)
})