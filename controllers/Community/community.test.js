const supertest = require('supertest')
const { http } = require('../../index.js')
const mongoose = require('mongoose')
require('dotenv').config({
    path:  '.env'
})

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMGNmMTc0YTc2NTBhMzM4NDU1OWJhNCIsImlhdCI6MTY0NzYxMTE3NX0.81kR6O4f7umjssBVyIVMit2zgt8pu6tJb8lpa3_00xc';

beforeAll(async ()=>{
    const { DATABASE_USER, DATABASE_PASSWORD, DATABASE_PORT } = process.env


    //BD
    await mongoose.connect(`mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:${DATABASE_PORT}/`, 
    { useNewUrlParser: true, useUnifiedTopology: true });
})

afterAll(async ()=>{
    await mongoose.disconnect()
})


test('POST /inn/community/register - must get status 406 if any param is missing', async()=>{
    
    
    //Not sending validation token
    const response = await supertest(http).post('/inn/community/register').send({
        name: '',
        description: ''
    });
    expect(response.statusCode).toBe(406);
});

test('GET /inn/community/get/', async()=>{
    const id = 'NotRegistered';
    const response = await supertest(http).get(`/inn/community/${id}`);

    expect(response.statusCode).toBe(404);
});

test('POST /inn/communities - must get status 406 if any param is missing', async()=>{

    //Not sending validation token
    const response = await supertest(http).get('/inn/communities');
    expect(response.statusCode).toBe(406);
});

test('POST /inn/community/sub - must get status 406 if any param is missing', async()=>{

    const id = '620cf56ef3ef06b26a42a93c';

    //Not sending validation token
    const response = await supertest(http).get(`/inn/community/sub/${id}`);

    expect(response.statusCode).toBe(406);
});

test('GET /inn/community/:id/:page/:user', async()=>{
    const response = await supertest(http).get('/inn/community/12/1/user')
    expect(response.statusCode).toBe(404);
});


test('POST /inn/community/register - must get status 406 if any param is missing', async()=>{
    
    //Must be a valid token
    const response = await supertest(http).post('/inn/community/register').send({
        name: 'A test post',
        description: '18/03/2022'
    }).set({
        authorization: token
    });
    expect(response.statusCode).toBe(201);
});

test('GET testing sub error handler', async ()=>{


    const id = '620cf56ef3ef06b26a42a93c';

    //Not sending validation token
    const response = await supertest(http).get(`/inn/community/sub/${id}`);

    expect(response.statusCode).toBe(406);
});

test('GET Testing sub', async ()=>{
    //Those variables are suposed to be from already registered data
    const id = '620cf56ef3ef06b26a42a93c';

    const response = await supertest(http).get(`/inn/community/sub/${id}`).set({
        authorization: token
    });

    expect(response.statusCode).toBe(200);
});

test('GET Testing unsub', async ()=>{
    //Those variables are suposed to be from already registered data
    const id = '620cf56ef3ef06b26a42a93c';

    const response = await supertest(http).get(`/inn/community/sub/${id}`).set({
        authorization: token
    });

    expect(response.statusCode).toBe(200);
});

test('GET Testing get communities by author route - Not sending authorization token', async ()=>{

    //Not sending authorization token
    const response = await supertest(http).get('/inn/communities');

    expect(response.statusCode).toBe(406)
});

test('GET Testing get communities by author route', async ()=>{

    const response = await supertest(http).get('/inn/communities').set({
        authorization: token
    });

    expect(response.statusCode).toBe(200);
});