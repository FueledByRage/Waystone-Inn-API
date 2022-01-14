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

test('POST /inn/login - it must return 404 if you use a not resgistered email 505 using a wrong password or 202 when everything is ok',
 async ()=>{
    const response = await supertest(http).post('/inn/login').send({
        email: '',
        password: ''
    })
    expect(response.statusCode).toBe(406)
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
