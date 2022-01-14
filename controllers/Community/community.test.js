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


test('POST /inn/community/register - must get status 406 if any param is missing', async()=>{
    const response = await supertest(http).post('/inn/community/register').send({
        name: '',
        description: ''
    })
    expect(response.statusCode).toBe(406)
})

test('GET /inn/user/get/:user', async()=>{
    const response = await supertest(http).get('/inn/community/notRegisteredId')
    expect(response.statusCode).toBe(404)
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

test('GET /inn/community/:id/:page/:user', async()=>{
    const response = await supertest(http).get('/inn/community/12/1/user')
    expect(response.statusCode).toBe(404)
})

test('POST /inn/communities/filter - must get status 406 if any param is missing', async()=>{
    const response = await supertest(http).post('/inn/communities/filter').send({
        name: undefined 
    })
    expect(response.statusCode).toBe(406)
})
