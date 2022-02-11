const { errorMsg } = require('../../../utils/helpers')

module.exports = {
  findAll
}

async function findAll(pg) {
  try {
    const { rows } = await pg.query(`
            SELECT * FROM growing_medium
        `)
    return rows
  } catch (error) {
    return errorMsg(error, 'Failed to get mediums')
  }
}
