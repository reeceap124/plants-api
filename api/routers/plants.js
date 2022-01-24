const router = require('express').Router()
const Plants = require('../../data/models/plants/plant_model')
const pg = require('../../utils/pool')
const { errorMsg } = require('../../utils/helpers')

router.get('/', async (req, res) => {
  const client = await pg.connect()
  try {
    const plants = await Plants.findAll(client)
    return res.status(200).json(plants)
  } catch (error) {
    return res
      .status(500)
      .json(errorMsg(error, 'Problem in router getting plants'))
  } finally {
    await client.release()
  }
})

module.exports = router
