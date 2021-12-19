const { errorMsg } = require("../../../utils/helpers");

module.exports = {
  add,
  find
};

async function add(pg, item, parent = null) {
  const { plants_key, status_key, cost } = item;
  try {
    const parentPlant = await find(pg, parent);
    if (parentPlant && parentPlant.plants_key !== plants_key) {
      throw new Error("Parent plant type must match the new plant to be added");
    }
    const { rows } = await pg.query(
      `
    with inv_insert as(insert into inventory (plants_key, ancestry, status_key, cost) values (
        $1, 
        -- If parent exists, prefix its ancestry onto plant to be added
        coalesce( $2, '') || (select currval(pg_get_serial_sequence('inventory', 'id'))::text)::ltree, 
        $3, 
        $4)
    RETURNING *)
    select i.*, i.cost::integer, p.common_name, p.scientific_name, s.status from inv_insert i
    join plants p on i.plants_key = p.id
    join inventory_statuses s on i.status_key = s.id
    `,
      [plants_key, parentPlant?.ancestry, status_key, cost]
    );
    return rows[0];
  } catch (err) {
    return errorMsg(err, "Failed to add plant");
  }
}

async function find(pg, id) {
  try {
    const { rows } = await pg.query(
      `
            SELECT * FROM inventory i
            JOIN plants p on p.id = i.plants_key
            JOIN inventory_statuses s on s.id = i.status_key
            WHERE i.id = $1;
        `,
      [id]
    );
    return rows?.length ? rows[0] : null;
  } catch (err) {
    return errorMsg(err, "Failed to get inventory item with id: " + id);
  }
}
