const supertest = require('supertest')
const { http } = require('../../index.js')
const mongoose = require('mongoose')
require('dotenv').config({
    path:  '.env'
})

beforeAll(async ()=>{
    console.log(process.env.MONGODB_URL)
    await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(()=>{
    mongoose.disconnect()
})

test('POST /inn/comment/register - gotta get an error since there is missing params', async()=>{
    const response = await supertest(http).post('/inn/comment/register').send({
        token: undefined,
        id: '15',
        comment: '5'
    })
    expect(response.statusCode).toBe(406)
})

test('GET /inn/comments/:id - gotta test if the route return a proper error since the id is not valid.',async()=>{
    const response = await supertest(http).get('/inn/comments/12')
    expect(response.statusCode).toBe(404)    
})

test('POST /inn/comment/deleteComment - The request will fail since the token is not defined.', async()=>{
    const response = await supertest(http).post('/inn/comment/deleteComment').send({
        token: undefined,
        id:'1'
    })
    expect(response.statusCode).toBe(406)
})

test('POST /inn/comment/deleteComment - The request will fail since the token is not from the comment author.', async()=>{
    const response = await supertest(http).post('/inn/comment/deleteComment').send({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZTBmOTJiM2FiYjcyMmMyODVkNGE4YyIsImlhdCI6MTYzNzEwMTExNX0.jS4BRAYbprOtyXlHQoDnQPPlzm23kdkp9pobrKiKyOE',
        id:'611bb8cab9086b0bd0c03f9c'
    })
    expect(response.statusCode).toBe(406)
})