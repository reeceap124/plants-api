const router = require('express').Router()
const Sales = require('../../data/models/sales/sales_model')
const pg = require('../../utils/pool')
const { errorMsg } = require('../../utils/helpers')

router.get('/:key/:value', async (req, res) => {
  const client = await pg.connect()
  const { key, value } = req.params
  try {
    const sales = await Sales.find(client, { key: value })
    return res.status(200).json(sales)
  } catch (error) {
    return res.status(500).json(errorMsg(error, 'Failed to get sales'))
  } finally {
    await client.release()
  }
})

router.post('/', async (req, res) => {
  const client = await pg.connect()
  const sale = req.body
  try {
    const newSale = await Sales.add(client, sale)
    return res.status(201).json(newSale)
  } catch (error) {
    return res.status(500).json(errorMsg(error, 'Failed to add sale'))
  } finally {
    await client.release()
  }
})

module.exports = router
