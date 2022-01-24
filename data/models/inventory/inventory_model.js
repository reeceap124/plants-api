const { errorMsg } = require('../../../utils/helpers')

module.exports = {
  add,
  find,
  findUsersPlants,
  update
}

async function add(pg, item, parent = null) {
  const { plants_key, status_key, cost } = item
  try {
    const parentPlant = await find(pg, parent)
    if (parentPlant && parentPlant.plants_key !== plants_key) {
      throw new Error('Parent plant type must match the new plant to be added')
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
    )
    return rows[0]
  } catch (err) {
    return errorMsg(err, 'Failed to add plant')
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
    )
    return rows?.length ? rows[0] : null
  } catch (err) {
    return errorMsg(err, 'Failed to get inventory item with id: ' + id)
  }
}

async function findUsersPlants(pg, user) {
  try {
    const { rows } = await pg.query(
      `
      select i.*, p.id as plant_id, p.common_name, p.scientific_name, s.id as status_id, s.status from inventory i
JOIN plants p on i.plants_key = p.id
JOIN inventory_statuses s on i.status_key = s.id
JOIN users u on i.users_key = u.id
WHERE u.id = $1
    `,
      [user]
    )
    return rows
  } catch (error) {
    return errorMsg(error, 'Failed to get inventory for user: ' + user)
  }
}

async function update(pg, change = {}, toChange = { id: 0 }) {
  if (change.id) {
    delete change.id
  }
  if (change.ancestry) {
    console.error('unable to update ancestry yet')
    return []
  }

  const columns = {
    id: 'id',
    plants_key: 'plants_key',
    ancestry: 'ancestry',
    status_key: 'status_key',
    cost: 'cost'
  }

  let base = ['UPDATE ', 'inventory', ' SET']
  let values = []
  const setCols = Object.keys(change)
    .map((key, index, arr) => {
      values.push(change[key])
      return ` %I = $${index + 1}${index !== arr.length - 1 ? ',' : ''}`
    })
    .join('')
  const setVals = Object.keys(change)
    .map((key, index, arr) => {
      return ` '${columns[key]}'${index !== arr.length - 1 ? ',' : ''}`
    })
    .join('')
  const { rows: setRes } = await pg.query(`select format(
    '${setCols}',
    ${setVals}
  )`)
  const set = setRes[0].format
  let where = Object.keys(toChange).map((key, index, arr) => {
    values.push(toChange[columns[key]])
    return ` ${columns[key]} = $${index + 1 + Object.keys(change).length} ${
      index !== arr.length - 1 ? 'AND ' : ''
    }`
  })

  const subQuery = [...base, ...set, ' WHERE', ...where, ' RETURNING *'].join(
    ''
  )
  const query = `
    with updated as (${subQuery})
    SELECT i.id, i.plants_key, i.ancestry, i.status_key, i.cost::integer, p.common_name, p.scientific_name, s.status from updated i
    JOIN plants p on i.plants_key = p.id
    JOIN inventory_statuses s on i.status_key = s.id
  `
  try {
    const { rows } = await pg.query(query, values)
    return rows
  } catch (err) {
    return errorMsg(err, 'Failed to update inventory for: ' + toChange)
  }
}
