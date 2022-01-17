const { Pool } = require('pg')

const dotenv = require('dotenv')

dotenv.config()
const dbString = () => {
  console.log('NODE_ENV: ', process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'test') {
    return process.env.TEST_DATABASE_URL
  }
  return process.env.DATABASE_URL
}
const connectionString = dbString()
const ssl =
  process.env.NODE_ENV === 'production'
    ? { ssl: { rejectUnauthorized: false } }
    : {}
const databaseConfig = { connectionString, ...ssl }
const pool = new Pool(databaseConfig)
pool.on('connect', (err, client) => {
  console.log('connected to db')
})
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

module.exports = pool
