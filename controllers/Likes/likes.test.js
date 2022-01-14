const supertest = require('supertest')
const { http } = require('../../index.js')
const mongoose = require('mongoose')

require('dotenv').config({
    path:  '.env'
})

beforeAll(async ()=>{
    //await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(()=>{
    //mongoose.disconnect()
})

test('Testing the connection', async ()=>{
    const response = await supertest(http).get('/inn/like/d')

    expect(response.statusCode).toBe(406)
})
