const pg = require('../../utils/pool')
const setup = async () => {
  const client = await pg.connect()
  await client.query(
    `truncate plants, inventory_statuses, sale_venues, sales, users, growing_medium, medium_history restart identity cascade`
  )
  await client.query(`
    INSERT INTO growing_medium (medium) VALUES ('soil'), ('spagnum moss'), ('water'), ('perlite')
  `)
  await client.query(`
    INSERT INTO users (username, email, password, active)
    VALUES ('tester', 'test@email.com', 'testPass', true)
  `)
  await client.query(`
    INSERT INTO plants (common_name, scientific_name, creator_key)
    VALUES 
    ('snake plant', 'Sansevieria trifasciata', 1)
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
  INSERT INTO inventory (plants_key, status_key, cost, ancestry, acquired_from, acquired_date, users_key, medium_key)
  VALUES 
  (1, 4, 100, '1', null, NOW(), 1, 2), 
  (1, 4, 0, '1.2', null, NOW(), 1, 2), 
  (1, 4, 0, '1.3', null, NOW(), 1, 2), 
  (1, 4, 0, '1.4', null, NOW(), 1, 2)
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
