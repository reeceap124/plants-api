const router = require('express').Router()
const pg = require('../../utils/pool')
const { errorMsg } = require('../../utils/helpers')
const Mediums = require('../../data/models/mediums')

router.get('/', async (req, res) => {
  const client = await pg.connect()

  try {
    const mediums = await Mediums.findAll(client)
    return res.status(200).json(mediums)
  } catch (error) {
    return res.status(500).json(errorMsg(error, 'Mediums router failed'))
  } finally {
    await client.release()
  }
})

module.exports = router
