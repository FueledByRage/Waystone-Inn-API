const supertest = require('supertest')
const { http } = require('../../index.js')
const mongoose = require('mongoose')
const { io } = require('socket.io-client')
require('dotenv').config({
    path:  '.env'
})
let socket

beforeAll(async ()=>{
    //await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(()=>{
    //mongoose.disconnect()
})

test('Testing the connection', async ()=>{
    const response = await supertest(http).post('/inn/like').send({})
    socket = io('http://localhost:8000')
    socket.on('here', mySocket =>{
        console.log(mySocket)
    })
    expect(response.statusCode).toBe(200)
})
