const router = require('express').Router()
const Users = require('../models/users/users_model')
const pg = require('../../utils/pool')
const { errorMsg } = require('../../utils/helpers')

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const client = await pg.connect()
  try {
    const users = await Users.find(client, id)
    if (!users) {
      return res.status(500).json('failed to return users')
    }
    return res.status(200).json(users)
  } catch (err) {
    return res.status(500).json(errorMsg(err, 'Route failed to get users'))
  } finally {
    await client.release()
  }
})

module.exports = router
