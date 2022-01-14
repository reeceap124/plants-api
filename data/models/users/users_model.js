const { errorMsg } = require('../../../utils/helpers')

module.exports = {
  find,
  add
}

async function add(pg, user) {
  try {
    const { rows } = await pg.query(
      `
        INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;
        `,
      [user.email, user.password]
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
