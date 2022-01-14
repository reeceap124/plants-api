const { Pool } = require('pg')

const dotenv = require('dotenv')

dotenv.config()
const dbString = () => {
  if (process.env.NODE_ENV === 'test') {
    console.log('ENV is test')
    return process.env.TEST_DATABASE_URL
  }
  return process.env.DATABASE_URL + '?rejectUnauthorized=false'
}
const connectionString = dbString()
console.log('connection string', connectionString)
const databaseConfig = { connectionString }
const pool = new Pool(databaseConfig)
pool.on('connect', (err, client) => {
  console.log('connected to db')
})
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

module.exports = pool
