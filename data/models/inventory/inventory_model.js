const pg = require("../../../utils/pool");

module.exports = {
  add
};

async function add(pg, item, parent = null) {
  //need to grab ancestry from parent id given and insert into coalesce
  const newItem = pg.query(`
  insert into inventory (plants_key, ancestry, status_key, cost) values (1, coalesce(::text, '') || (select currval(pg_get_serial_sequence('inventory', 'id'))::text)::ltree, 1, 100)

  `);
}
