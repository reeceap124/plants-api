const model = require('../../data/models/users/users_model')
const pg = require('../../utils/pool')
const { generateToken } = require('../../utils/helpers')
const router = require('express').Router()
const bcrypt = require('bcrypt')

router.post('/register', async (req, res) => {
  const credentials = req.body
  const { email, username, password, confirmPassword } = credentials

  if (password !== confirmPassword) {
    return res
      .status(401)
      .json({ message: 'Password and confirmation do not match' })
  }
  delete credentials.confirmPassword

  if (username && email && password) {
    credentials.password = await bcrypt.hash(credentials.password, 12)
    const client = await pg.connect()
    try {
      const user = await model.add(client, credentials)
      if (!user) {
        throw new Error('Unable to register user with those credentials')
      }
      console.log('my user', user)
      const token = generateToken(user)
      return res.status(201).json({ status: 'success', token, user })
    } catch (err) {
      return res.status(500).json({ status: 'failed', message: err.message })
    } finally {
      await client.release()
    }
  } else {
    return res.status(400).json({
      status: 'failed',
      message: 'Invalid credentials'
    })
  }
})

router.post('/login', async (req, res) => {
  const client = await pg.connect()
  const credentials = req.body
  const { email, password } = credentials
  if (email && password) {
    try {
      const user = await model.findBy(client, { email })
      if (user && bcrypt.compareSync(password, user.password)) {
        delete user.password
        const token = generateToken(user)
        return res.status(200).json({ status: 'success', token, user })
      } else {
        return res
          .status(400)
          .json({ status: 'failed', message: 'Invalid credentials' })
      }
    } catch (err) {
      console.error({ error: err })
      return res
        .status(500)
        .json({ status: 'failed', message: 'Error logging in', error: err })
    } finally {
      await client.release()
    }
  }
})

module.exports = router
