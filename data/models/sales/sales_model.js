const { errorMsg } = require('../../../utils/helpers')

module.exports = {
  add
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
    if (newSale && newSale.length && newSale[0].id === sale.id) {
      await pg.query(`UPDATE TABLE inventory SET status = 5 WHERE id = $1`, [
        sale.inventory_key
      ])
    }

    return newSale[0]
  } catch (err) {
    return errorMsg(err, 'Failed to add sale')
  }
}
