const express = require('express')
const app = express()
const http = require('http').createServer(app)


const cors = require('cors')
const path = require('path')
const router = require('./routes')
const errorMiddleware = require('./middlewares/errorMiddleware')

//Some config of express
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/inn/img',
express.static(path.resolve(__dirname, 'uploads', 'img'))
)

//Routes
app.use('/inn', router)

app.use(errorMiddleware)

module.exports = { http: http }