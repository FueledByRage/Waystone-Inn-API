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


test('POST /inn/community/register - must get status 406 if any param is missing', async()=>{
    const response = await supertest(http).post('/inn/community/register').send({
        name: '',
        description: ''
    }).set({
        authorization: ''
    });
    expect(response.statusCode).toBe(406)
})

test('GET /inn/user/get/:user', async()=>{
    const response = await supertest(http).get('/inn/community/notRegisteredId')
    expect(response.statusCode).toBe(404)
})

test('POST /inn/communities - must get status 406 if any param is missing', async()=>{
    const response = await supertest(http).post('/inn/communities').send({
    }).set({
        authorization: undefined
    });
    expect(response.statusCode).toBe(406)
})

test('POST /inn/community/sub - must get status 406 if any param is missing', async()=>{
    const response = await supertest(http).post('/inn/community/sub').send({
        id: undefined,   
    }).set({
        authorization: undefined
    });
    expect(response.statusCode).toBe(406)
})

test('GET /inn/community/:id/:page/:user', async()=>{
    const response = await supertest(http).get('/inn/community/12/1/user')
    expect(response.statusCode).toBe(404)
})

test('POST /inn/communities/filter - must get status 406 if any param is missing', async()=>{
    const response = await supertest(http).post('/inn/communities/filter').send({
        name: undefined 
    }).set({
        authorization: ''
    });
    expect(response.statusCode).toBe(406)
})
