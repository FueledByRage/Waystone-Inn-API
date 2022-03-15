# The-Waystone-Inn-Backend

This is the backend of a personal projetct.

It's an API built using the usual NodeJs stack and MongoDB as it's database.
Since the project is a Reddit like, this API store profiles, communities, posts and comments.

# About the project

This is part of my personal portfolio, since i haven't built nothing authorial using this stack my main goal was to improve skills as put into practice the knowledge acquired through my studies. 

# How to use it

Clone it

`gh repo clone FueledByRage/WaystoneInnApi`

You can open it on your IDE and run npm update

`npm update`

create a .env file with the variables 

API_PORT 
DATABASE_PORT 
DATABASE_NAME 
DATABASE_USER
DATABASE_PASSWORD
SECRET_KEY
URL (uploaded files base url)

configure the docker-compose file 

init the mongodb docker using the docker compose

`docker-compose up`

runs npm start

`npm start`

# Tests

Delete and get tests require tokens and id's, what require dummies data.

You can find automated test on app.test.js in the very project root. Run the test command to check out their logs.

`npm test`

Or you can run test for individual routes 

`npm run <route category>`

Exemple:

`npm run users`

All individual .test files are inside their respective controllers directory

# Routes

The base URL is http://localhost:8000/inn/

## User:

ENDPOINT | METHOD | PARAMS | EXPECTED SUCCESS | EXPECTED ERROR
---------|--------|--------|------------------|---------------|
/login | POST | Email, password | CODE 200 - ok Return user's token and list of subs | {Message with error description} 
/user/register| POST | Email, name, user and password | CODE 201 - ok Register a new user and return it | {Message with error description} 
/user/edit | POST | file | CODE 200 - ok Edit a profile photo of an user | {Message with error description} 
/user/get/:user | GET | user | CODE 200 - ok User's data | {Message with error description} 

## Community: 

ENDPOINT | METHOD | PARAMS | EXPECTED SUCCESS | EXPECTED ERROR
---------|--------|--------|------------------|---------------|
/community/register | POST | token, name and description | CODE 201 - ok Register a new community and return it | {Message with error description} 
/community/sub | POST | token, id | CODE 200 - ok Subscribe a user to a community | {Message with error description} 
/community/:id/:page | GET | id, page | CODE 200 - ok Get data of a community and a limited number of posts using the page param | {Message with error description} 
/community/:id/ | GET | id | CODE 200 - ok Get data of a community | {Message with error description} 
/communities | GET | Authorization Header | CODE 200 - ok Return the communities from a user | {Message with error description}
/communities/:name | GET | community name | CODE 200 - ok Get data of a community using its name as param | {Message with error description} 

## Post:

ENDPOINT | METHOD | PARAMS | EXPECTED SUCCESS | EXPECTED ERROR
---------|--------|--------|------------------|---------------|
/post/register | POST | token, title, body or file and Authorization token | CODE 200 - ok Register a post and return it | { Message with error description}
/post/:id | GET | id | CODE 200 - ok Get a post using the post id as param | { Message with error description}
/post/:id/:page/:registers | GET | id, page, number of register to return | CODE 200 - ok Return a number of posts based on community id and a page number as param | { Message with error description}
/posts/feed/:page/:registers | GET | subs, page and Authorization token | CODE 200 - ok it's receive the currenty page of a index and a mod that gonna be added to the page number and return a number of post from a list get using the subs as param | { Message with error description}
/post/deletePost/:id | DELETE | id, Authorization token | CODE 200 - ok Delete a post by it's id | { Message with error description}

## Comment:

ENDPOINT | METHOD | PARAMS | EXPECTED SUCCESS | EXPECTED ERROR
---------|--------|--------|------------------|---------------|
/comment/register | POST | token, postId, comment | CODE 201 - ok Register a new comment and return it | { Message with error description}
/comments/:id| GET | id | CODE 200 - ok Return comments from a post based on it's id  | { Message with error description}
/comment/deleteComment/:id | DELETE | id, token | CODE 200 - ok Delete a comment taking it's id as param | { Message with error description}

# Powered by:

- [Express](https://www.npmjs.com/package/express) - Server
- [MongoDB](https://www.mongodb.com) - Database
- [CORS](https://www.npmjs.com/package/cors) - Enable CORS with Express
- [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Provide JWT
- [Mongoose](https://www.npmjs.com/package/mongoose) - MongoDB modeling tool

by [Erik](https://www.linkedin.com/in/erik-natan-moreira-santos-983865195/)
