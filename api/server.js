const express = require('express')
const server = express()
const user = require('./routers/users')
const auth = require('./routers/auth')
const cors = require('cors')
const helmet = require('helmet')
server.use(express.json())
server.use(cors())
server.use(helmet())
server.use('/api/auth', auth)
server.all('/', (req, res) => res.send('Server is live'))

module.exports = server
