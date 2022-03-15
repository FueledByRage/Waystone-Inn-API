const supertest = require('supertest')
const { http } = require('../../index.js')
const mongoose = require('mongoose')
require('dotenv').config({
    path:  '.env'
});
 

beforeAll(async ()=>{
    const { DATABASE_USER, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_NAME, API_PORT } = process.env


    //BD
    await mongoose.connect(`mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:${DATABASE_PORT}/`, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async ()=>{
    await mongoose.disconnect()
});

test('POST /inn/comment/register - gotta get an error since there is missing params', async()=>{

        //Must be invalide
        const id = '';

    //Not sending authorization token
    const response = await supertest(http).post('/inn/comment/register').send({
        id: id,
        comment: '1234'
    });

    expect(response.statusCode).toBe(406);
});

test('POST /inn/comment/register - Testing if it is possible to comment', async()=>{

    //Must be valide
    const id = '';
    const token = '';
    
    const response = await supertest(http).post('/inn/comment/register').send({
        id: '15',
        comment: 'Teste'
    }).set({
        authorization: token
    });
    expect(response.statusCode).toBe(406);
});

test('GET /inn/comments/:id - gotta test if the route return a proper error since the id is not valid.',async()=>{
    const response = await supertest(http).get('/inn/comments/12')
    expect(response.statusCode).toBe(404)    
});

test('POST /inn/comment/deleteComment - The request will fail since the token is not defined.', async()=>{
    
    //Not sending authorization token
    
    const response = await supertest(http).post('/inn/comment/deleteComment').send({
        id:'1'
    });

    expect(response.statusCode).toBe(406)
});

test('POST /inn/comment/deleteComment - The request will fail since the token is not from the comment author.', async()=>{
    
    //Not sending authorization token

    
    const response = await supertest(http).post('/inn/comment/deleteComment').send({
        id:'611bb8cab9086b0bd0c03f9c'
    });
    expect(response.statusCode).toBe(406)
});