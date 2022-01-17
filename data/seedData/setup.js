const pg = require('../../utils/pool')
const setup = async () => {
  const client = await pg.connect()
  await client.query(
    `truncate plants, inventory_statuses, sale_venues, sales, users restart identity cascade`
  )
  await client.query(`
    INSERT INTO plants (common_name, scientific_name)
    VALUES 
    ('snake plant', 'Sansevieria trifasciata')
    `)
  await client.query(`
  INSERT INTO inventory_statuses (status)
  VALUES
    ('personal'),
    ('mother'),
    ('not for sale'),
    ('for sale'),
    ('sold'),
    ('dead');
  `)
  await client.query(`
  INSERT INTO inventory (plants_key, status_key, cost, ancestry)
  VALUES (1, 4, 100, '1'), (1, 4, 0, '1.2'), (1, 4, 0, '1.3'), (1, 4, 0, '1.4')
  `)
  await client.query(`
  INSERT INTO sale_venues (name)
  VALUES
    ('Facebook Marketplace'),
    ('Etsy');
  `)

  await client.release()
}

module.exports = async () => await setup()
