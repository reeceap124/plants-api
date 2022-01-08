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
    expect(inventory_sale[0].status_key).toBe('5')
  })

  it('should find some sales', async () => {
    const salesObjs = [2, 3, 4].map((k) => ({
      venue_key: 1,
      sale_amount: 15 + k,
      tax_amount: 0,
      inventory_key: k,
      shipping_amount: 0,
      shipped: false
    }))
    const sales = await Promise.all(
      salesObjs.map(async (s) => {
        return await model.add(client, s)
      })
    )
    //find a specific sale
    //find all sales for a mother
    const oneSale = await model.find(client, { inventory_key: 2 })
    expect(oneSale.length).toBe(1)
    expect(oneSale[0].inventory_key).toBe('2')
  })
})
