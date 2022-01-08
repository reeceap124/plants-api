const { errorMsg } = require('../../../utils/helpers')

module.exports = {
  add,
  find
}

async function add(pg, sale) {
  const {
    venue_key,
    sale_amount,
    tax_amount,
    inventory_key,
    sale_date = new Date(),
    shipping_amount,
    shipped
  } = sale
  try {
    const { rows: newSale } = await pg.query(
      `
    INSERT INTO sales (venue_key, sale_amount, tax_amount, inventory_key, sale_date, shipping_amount, shipped)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
      [
        venue_key,
        sale_amount,
        tax_amount,
        inventory_key,
        sale_date,
        shipping_amount,
        shipped
      ]
    )
    if (
      newSale &&
      newSale.length &&
      parseInt(newSale[0].inventory_key) === sale.inventory_key
    ) {
      await pg.query(`UPDATE inventory SET status_key = 5 WHERE id = $1`, [
        sale.inventory_key
      ])
    }

    return newSale[0]
  } catch (err) {
    return errorMsg(err, 'Failed to add sale')
  }
}

async function find(pg, toFind) {
  const columns = {
    venue_key: 'venue_key',
    inventory_key: 'inventory_key',
    shipped: 'shipped'
  }
  const values = []
  colVals = []
  const where = Object.keys(toFind)
    .map((key, index) => {
      if (columns[key]) {
        values.push(toFind[key])
        colVals.push(`'${columns[key]}'`)
        return ` %I = $${index + 1}`
      }
    })
    .join('AND')
  const { rows: query } = await pg.query(
    `select format('SELECT * FROM sales WHERE${where}', ${colVals.join(', ')})`
  )
  try {
    const { rows: sales } = await pg.query(query[0].format, values)
    return sales
  } catch (err) {
    return errorMsg(err, 'Failed to find sales with: ', toFind)
  }
}
