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

test('POST /inn/login - it must return 404 if you use a not resgistered email 505 using a wrong password or 202 when everything is ok',
 async ()=>{
    const response = await supertest(http).post('/inn/login').send({
        email: '',
        password: ''
    }).set({
        authorization: ''
    });
    expect(response.statusCode).toBe(406)
})

test('POST /inn/user/register - must get status 406 if any param is missing', async()=>{
    const response = await supertest(http).post('/inn/user/register').send({
        email: '',
        password: ''
    }).set({
        authorization: ''
    });
    expect(response.statusCode).toBe(406)
})

test('GET /inn/user/get/:user', async()=>{
    const response = await supertest(http).get('/inn/user/get/notRegistered')
    expect(response.statusCode).toBe(404)
})
