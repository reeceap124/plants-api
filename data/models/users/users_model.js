const { errorMsg } = require('../../../utils/helpers')

module.exports = {
  find,
  findBy,
  add
}

async function add(pg, user) {
  try {
    const { rows } = await pg.query(
      `
        INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *;
        `,
      [user.email, user.password, user.username]
    )
    return rows[0]
  } catch (err) {
    return errorMsg(err, 'Failed to add user')
  }
}

async function find(pg, id) {
  try {
    const { rows } = await pg.query(
      `
                SELECT * FROM users
                WHERE id = $1;
            `,
      [id]
    )
    return rows
  } catch (err) {
    return errorMsg(err, 'Failed to find users at id: ' + id)
  }
}

async function findBy(pg, value) {
  const columns = { id: 'id', email: 'email' }
  const column = Object.keys(value)[0]
  try {
    const { rows: query } = await pg.query(`
    SELECT format ('SELECT * FROM users WHERE %I = $1', '${columns[column]}')
    `)
    const { rows: user } = await pg.query(query[0].format, [value[column]])
    return user[0]
  } catch (err) {
    return errorMsg(
      err,
      'Failed to get user by ' + column + ' with value ' + value[column]
    )
  }
}
