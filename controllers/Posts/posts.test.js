const supertest = require('supertest')
const { http } = require('../../index.js')
const mongoose = require('mongoose')
require('dotenv').config({
    path:  '.env'
})


beforeAll(async ()=>{
    await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(()=>{
    mongoose.disconnect()
})


test('POST /inn/post/register - This request gotta get an error since the token is invalid', async()=>{
    const response = await supertest(http).post('/inn/post/register').send({
        title: 'okay',
        id: 'test'
    }).set('Authorization', '2')
    expect(response.statusCode).toBe(406)
})

test('POST /inn/posts - Must get a 406 error status', async () =>{
    const response = await supertest(http).post('/inn/posts').send({
        subs: undefined
    })
    expect(response.statusCode).toBe(406)
})

test('GET /inn/post/:id - A error must be received once the id is invalid', async ()=>{
    const response = await supertest(http).get('/inn/post/2')
    expect(response.statusCode).toBe(404)
})

test('GET /inn/posts/:id/:page - Testing whether the response is the expected in invalid id case', async()=>{
    const response = await supertest(http).get('/inn/posts/1/1')
    expect(response.statusCode).toBe(404)
})

test('POST /inn/post/deletePost - Making sure the server throw an error if the token is invalid', async()=>{
    const response = await supertest(http).post('/inn/post/deletePost').send({
    }).set('Authorization', '2')
    expect(response.statusCode).toBe(406)
})


test('POST /inn/post/deletePost - Making sure the server throw an error if once the id is invalid', async()=>{
    const response = await supertest(http).post('/inn/post/deletePost').send({
        id: '1'
    }).set('Authorization', ' ')
    expect(response.statusCode).toBe(406)
})

test('POST', async () =>{
    const response =  await supertest(http).post('/inn/post/register').send({})
    expect(response.statusCode).toBe(406)
})

