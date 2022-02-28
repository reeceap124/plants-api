const express = require('express')
const server = express()
const inventory = require('./routers/inventory')
const statuses = require('./routers/statuses')
const plants = require('./routers/plants')
const auth = require('./routers/auth')
const mediums = require('./routers/mediums')
const sales = require('./routers/sales')
const cors = require('cors')
const helmet = require('helmet')
server.use(express.json())
server.use(cors())
server.use(helmet())
server.use('/api/auth', auth)
server.use('/api/inventory', inventory)
server.use('/api/statuses', statuses)
server.use('/api/plants', plants)
server.use('/api/talk-to-ghosts', mediums)
server.use('/api/sales', sales)
server.all('/', (req, res) => res.send('Server is live'))

module.exports = server

//sales unique constraint on inventory_key. Can only sell something once
