const express = require('express')
const server = express()
const user = require('../data/routers/users')

server.use(express.json())
server.use('/users', user)
server.all('/', (req, res) => res.send('Server is live'))

module.exports = server
