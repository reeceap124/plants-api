const router = require('express').Router()
const Inventory = require('../../data/models/inventory/inventory_model')
const pg = require('../../utils/pool')
const { errorMsg } = require('../../utils/helpers')

router.get('/all/:id', async (req, res) => {
  const { id } = req.params
  const client = await pg.connect()
  try {
    const plants = await Inventory.findUsersPlants(client, id)
    return res.status(200).json(plants)
  } catch (error) {
    return res
      .status(500)
      .json(errorMsg(error, 'Failed to get plants for user with id ' + id))
  } finally {
    await client.release()
  }
})

router.post('/', async (req, res) => {
  const client = await pg.connect()
  const { plant, parent } = req.body
  try {
    const newInventory = await Inventory.add(client, plant, parent)
    return res.status(201).json(newInventory)
  } catch (error) {
    return res.status(500).json(errorMsg(error, 'Failed to add inventory item'))
  } finally {
    await client.release()
  }
})

module.exports = router
