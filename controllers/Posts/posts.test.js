const supertest = require('supertest')
const { http } = require('../../index.js')
const mongoose = require('mongoose')
require('dotenv').config({
    path:  '.env'
});


beforeAll(async ()=>{
    const { DATABASE_USER, DATABASE_PASSWORD, DATABASE_PORT } = process.env


    //BD
    await mongoose.connect(`mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:${DATABASE_PORT}/`, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(()=>{
    await mongoose.disconnect();
});


test('POST /inn/post/register - This request gotta get an error since the token is invalid', async()=>{
    const response = await supertest(http).post('/inn/post/register').send({
        title: 'okay',
        id: 'test'
    }).set('Authorization', '2')
    expect(response.statusCode).toBe(406)
});

test('POST /inn/posts - Must get a 406 error status', async () =>{
    const response = await supertest(http).post('/inn/posts').send({
        id: undefined
    })
    expect(response.statusCode).toBe(406)
});

test('GET /inn/post/:id - A error must be received once the id is invalid', async ()=>{
    const response = await supertest(http).get('/inn/post/2')
    expect(response.statusCode).toBe(404)
});

test('GET /inn/posts/:id/:page - Testing whether the response is the expected in invalid id case', async()=>{
    const response = await supertest(http).get('/inn/posts/1/1')
    expect(response.statusCode).toBe(404)
});

test('POST /inn/post/deletePost - Making sure the server throw an error if the token is invalid', async()=>{
    const response = await supertest(http).post('/inn/post/deletePost').send({
    }).set('Authorization', '2')
    expect(response.statusCode).toBe(406)
});


test('POST /inn/post/deletePost - Making sure the server throw an error if once the id is invalid', async()=>{
    const response = await supertest(http).post('/inn/post/deletePost').send({
        id: '1'
    }).set('Authorization', ' ');
    expect(response.statusCode).toBe(406)
});

/*
test('POST ', async () =>{
    const response =  await supertest(http).post('/inn/post/register').send({
        id: '620cf56ef3ef06b26a42a93c',
        title: 'Testing posts',
        body: 'A test 2',

    }).set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMjVmOTkxZTg4MzIwMTk0MDY4NDdmYSIsImlhdCI6MTY0NjY2MDA3OX0.Xc1SZV8XQPq_zJQ9kDaJK1lI0_W1bmqEpnD1XoLxZVk');
    expect(response.statusCode).toBe(201)
});*/

