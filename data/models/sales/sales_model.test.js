const pg = require('../../../utils/pool')
const model = require('./sales_model')

describe('sales tests', () => {
  let client
  beforeAll(async () => {
    client = await pg.connect()
    await pg.query(``)
  })
  afterAll(async () => {
    await client.release()
    await pg.end()
  })

  it('should record a sale', async () => {
    // should update both sales and inventory
    const sale = await model.add(client, {
      venue_key: 1,
      sale_amount: 30,
      tax_amount: 0,
      inventory_key: 1,
      shipping_amount: 0,
      shipped: false
    })
    expect(sale.id).toBe('1')
    const { rows: inventory_sale } = await client.query(`
    SELECT * FROM inventory WHERE id = 1;
    `)
    expect(inventory_sale[0].id).toBe(sale.inventory_key)
  })
})
