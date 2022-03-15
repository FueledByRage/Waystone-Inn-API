const supertest = require('supertest')
const { http } = require('../../index.js')
const mongoose = require('mongoose')

require('dotenv').config({
    path:  '.env'
})

beforeAll(async ()=>{
    const { DATABASE_USER, DATABASE_PASSWORD, DATABASE_PORT } = process.env;


    //BD
    await mongoose.connect(`mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:${DATABASE_PORT}/`, { useNewUrlParser: true, useUnifiedTopology: true });
})

afterAll(()=>{
    mongoose.disconnect();
})

test('GET /inn/like/:id', async ()=>{

    //it must be a valid id and token
    const postId = '62260a4fdf8a3a1a08d26557';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMjVmOTkxZTg4MzIwMTk0MDY4NDdmYSIsImlhdCI6MTY0NjY5MDEwNn0.rUFnmaKAiN1y2mwskcEUSo2LE6rNPSfwHHZQoz2O-Cs';

    const response = await supertest(http).get(`/inn/like/${postId}`).set({
        authorization: token
    });

    expect(response.statusCode).toBe(200);
});

test('GET /inn/like/:id - Testing the error handling', async ()=>{

    //it must be a invalid id
    const postId = 'invalid';

    //Not sending a token
    const response = await supertest(http).get(`/inn/like/${postId}`);

    expect(response.statusCode).toBe(406);
});

test('GET /inn/dislike/:id', async ()=>{

    //it must be a valid id and token
    const postId = '62260abf46ac671fbcab7c03';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMjVmOTkxZTg4MzIwMTk0MDY4NDdmYSIsImlhdCI6MTY0NjY5MDEwNn0.rUFnmaKAiN1y2mwskcEUSo2LE6rNPSfwHHZQoz2O-Cs';

    const response = await supertest(http).get(`/inn/dislike/${postId}`).set({
        authorization: token
    });

    expect(response.statusCode).toBe(200);
});

test('GET /inn/dislike/:id - Testing the error handling', async ()=>{

    //it must be a invalid id or token
    const postId = 'invalid';
        
    //Not sending a token

    const response = await supertest(http).get(`/inn/dislike/${postId}`);

    expect(response.statusCode).toBe(406);
});