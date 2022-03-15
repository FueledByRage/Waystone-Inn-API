const supertest = require('supertest')
const { http } = require('../../index.js')
const mongoose = require('mongoose')
require('dotenv').config({
    path:  '.env'
})


beforeAll(async ()=>{
    const { DATABASE_USER, DATABASE_PASSWORD, DATABASE_PORT } = process.env


    //BD
    await mongoose.connect(`mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:${DATABASE_PORT}/`, { useNewUrlParser: true, useUnifiedTopology: true });
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
});

test('POST /inn/login - it must return 404 if you use a not resgistered email 505 using a wrong password or 202 when everything is ok',
 async ()=>{
    const response = await supertest(http).post('/inn/login').send({
        email: 'erkmgwr@gmail.com',
        password: 'gomugomu'
    }).set({
        authorization: ''
    });
    expect(response.statusCode).toBe(200)
});


test('POST /inn/user/register - must get status 406 if any param is missing', async()=>{
    const response = await supertest(http).post('/inn/user/register').send({
        email: '',
        password: ''
    }).set({
        authorization: ''
    });
    expect(response.statusCode).toBe(406)
});

test('POST /inn/user/register - must get status 406 if any param is missing', async()=>{
    const response = await supertest(http).post('/inn/user/register').send({
        name: 'Erik Natan',
        user: 'Ace',
        email: 'natan@gmail.com',
        password: '1234'
    }).set({
        authorization: ''
    });
    expect(response.statusCode).toBe(201);
});

test('GET /inn/user/get/:user', async()=>{
    const response = await supertest(http).get('/inn/user/get/notRegistered')
    expect(response.statusCode).toBe(404)
});


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
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMjVmOTkxZTg4MzIwMTk0MDY4NDdmYSIsImlhdCI6MTY0NjczOTY5NH0.eTjI8uRVBpGFRt9xu_hWMEjS5Zrhw3otqXei14z3BvE';

    const response = await supertest(http).post('/inn/community/register').send({
        name: 'A test post',
        description: '07/03/2022'
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
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMjVmOTkxZTg4MzIwMTk0MDY4NDdmYSIsImlhdCI6MTY0NjczOTY5NH0.eTjI8uRVBpGFRt9xu_hWMEjS5Zrhw3otqXei14z3BvE';
    const id = '620cf56ef3ef06b26a42a93c';

    const response = await supertest(http).get(`/inn/community/sub/${id}`).set({
        authorization: token
    });

    expect(response.statusCode).toBe(200);
});

test('GET Testing unsub', async ()=>{
    //Those variables are suposed to be from already registered data
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMjVmOTkxZTg4MzIwMTk0MDY4NDdmYSIsImlhdCI6MTY0NjczOTY5NH0.eTjI8uRVBpGFRt9xu_hWMEjS5Zrhw3otqXei14z3BvE';
    const id = '620cf56ef3ef06b26a42a93c';

    const response = await supertest(http).get(`/inn/community/sub/${id}`).set({
        authorization: token
    });

    expect(response.statusCode).toBe(200);
});


test('POST /inn/post/register - This request gotta get an error since the token is invalid', async()=>{
    const response = await supertest(http).post('/inn/post/register').send({
        title: 'okay',
        id: 'test'
    }).set('Authorization', '2');
    expect(response.statusCode).toBe(406);
});

test('POST /inn/posts - Must get a 406 error status', async () =>{
    const id = 'invalid';
    const token = null;

    const response = await supertest(http).get(`/inn/post/${id}`).set('Authorization', token);
    expect(response.statusCode).toBe(404);
});

test('GET /inn/posts/:id/:page - Testing whether the response is the expected in invalid id case', async()=>{
    const response = await supertest(http).get('/inn/posts/1/1');
    expect(response.statusCode).toBe(404);
});

test('POST /inn/post/deletePost - Making sure the server throw an error if the token is invalid', async()=>{
    const response = await supertest(http).post('/inn/post/deletePost').send({
    }).set('Authorization', '2');
    expect(response.statusCode).toBe(406);
});


test('DELETE /inn/post/deletePost - Making sure the server throw an error if once the id is invalid', async()=>{
    const id = 'someId';
    //Not sending token
    const response = await supertest(http).delete(`/inn/post/${id}`);
    expect(response.statusCode).toBe(406);
});

/*
test('POST ', async () =>{
    const response =  await supertest(http).post('/inn/post/register').send({
        id: '620cf56ef3ef06b26a42a93c',
        title: 'Testing posts',
        body: 'A test 2',

    }).set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMjVmOTkxZTg4MzIwMTk0MDY4NDdmYSIsImlhdCI6MTY0NjY2MDA3OX0.Xc1SZV8XQPq_zJQ9kDaJK1lI0_W1bmqEpnD1XoLxZVk');;
    expect(response.statusCode).toBe(201);
});*/


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