const { errorMsg } = require("../../../utils/helpers");

module.exports = {
  add,
  find
};

async function add(pg, status) {
  try {
    const { rows } = await pg.query(
      `
        INSERT INTO public.inventory_statuses (status)
        VALUES ($1) 
        RETURNING *;
        `,
      [status]
    );
    return rows[0];
  } catch (err) {
    return errorMsg(err, "Failed to insert status: " + status);
  }
}

async function find(pg, id) {
  try {
    const { rows } = await pg.query(
      `
        SELECT * FROM public.inventory_statuses
        WHERE id = $1
        `,
      [id]
    );
    return rows[0];
  } catch (err) {
    return errorMsg(err, "Failed to find status at id: " + id);
  }
}
