const pg = require("../../utils/pool");
const setup = async () => {
  const client = await pg.connect();
  await client.query(`
    INSERT INTO plants (common_name, scientific_name)
    VALUES 
    ('snake plant', 'Sansevieria trifasciata')
    `);
  await client.query(`
  INSERT INTO inventory_statuses (status)
  VALUES
    ('active'),
    ('sold'),
    ('dead');  
  `);
};

module.exports = async () => await setup();
