const router = require('express').Router()
const Statuses = require('../../data/models/statuses/statuses_model')
const pg = require('../../utils/pool')
const { errorMsg } = require('../../utils/helpers')

router.get('/', async (req, res) => {
  const client = await pg.connect()
  try {
    const statuses = await Statuses.findAll(client)
    return res.status(200).json(statuses)
  } catch (error) {
    return res
      .status(500)
      .json(errorMsg(error, 'Problem in router getting statuses'))
  } finally {
    await client.release()
  }
})

module.exports = router
