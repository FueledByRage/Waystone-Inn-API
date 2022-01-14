const supertest = require('supertest')
const { http } = require('../index.js')
const mongoose = require('mongoose')
const { post } = require('../routes/index.js')
require('dotenv').config({
    path:  './.env'
})

beforeAll(async ()=>{
    await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(()=>{
    mongoose.disconnect()
})

// User routes

test('POST /inn/login - it must return 404 if you use a not resgistered email 505 using a wrong password or 202 when everything is ok',
 async ()=>{
    const response = await supertest(http).post('/inn/login').send({
        email: '',
        password: ''
    })
    expect(response.statusCode).toBe(404)
})

test('POST /inn/user/register - must get status 406 if any param is missing', async()=>{
    const response = await supertest(http).post('/inn/user/register').send({
        email: '',
        password: ''
    })
    expect(response.statusCode).toBe(406)
})

test('GET /inn/user/get/:user', async()=>{
    const response = await supertest(http).get('/inn/user/get/notRegistered')
    expect(response.statusCode).toBe(404)
})

//Community routes

test('POST /inn/community/register - must get status 406 if any param is missing', async()=>{
    const response = await supertest(http).post('/inn/community/register').send({
        name: '',
        description: ''
    })
    expect(response.statusCode).toBe(406)
})

test('GET /inn/user/get/:user', async()=>{
    const response = await supertest(http).get('/inn/community/notRegisteredId')
    expect(response.statusCode).toBe(500)
})

test('POST /inn/communities - must get status 406 if any param is missing', async()=>{
    const response = await supertest(http).post('/inn/communities').send({
        token: undefined
    })
    expect(response.statusCode).toBe(406)
})

test('POST /inn/community/sub - must get status 406 if any param is missing', async()=>{
    const response = await supertest(http).post('/inn/community/sub').send({
        token: undefined,
        id: undefined,   
    })
    expect(response.statusCode).toBe(406)
})

test('GET /inn/community/:id/:page', async()=>{
    const response = await supertest(http).get('/inn/community/12/1')
    expect(response.statusCode).toBe(500)
})

test('POST /inn/communities/filter - must get status 406 if any param is missing', async()=>{
    const response = await supertest(http).post('/inn/communities/filter').send({
        name: undefined 
    })
    expect(response.statusCode).toBe(406)
})

//Comments routes
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
    expect(response.statusCode).toBe(500)
})

//Posts routes

test('POST /inn/post/register - This request gotta get an error since the token is invalid', async()=>{
    const response = await supertest(http).post('/inn/post/register').send({
        token: '2',
        title: 'okay',
        id: 'test'
    })
    expect(response.statusCode).toBe(500)
})

test('POST /inn/posts - Must get a 406 error status', async () =>{
    const response = await supertest(http).post('/inn/posts').send({
        subs: undefined
    })
    expect(response.statusCode).toBe(406)
})

test('GET /inn/post/:id - A error must be received once the id is invalid', async ()=>{
    const response = await supertest(http).get('/inn/post/2')
    expect(response.statusCode).toBe(500)
})

test('GET /inn/posts/:id/:page - Testing whether the response is the expected in invalid id case', async()=>{
    const response = await supertest(http).get('/inn/posts/1/1')
    expect(response.statusCode).toBe(500)
})

test('POST /inn/post/deletePost - Making sure the server throw an error if the token is invalid', async()=>{
    const response = await supertest(http).post('/inn/post/deletePost').send({
        token: 2
    })
    expect(response.statusCode).toBe(406)
})


test('POST /inn/post/deletePost - Making sure the server throw an error if once the id is invalid', async()=>{
    const response = await supertest(http).post('/inn/post/deletePost').send({
        token: '',
        id: '1'
    })
    expect(response.statusCode).toBe(406)
})

test('POST', async () =>{
    const response = await supertest(http).post('/inn/post/register').send({
        token: '',
    })
    expect(response.statusCode).toBe(406)
})