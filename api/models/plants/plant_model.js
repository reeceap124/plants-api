module.exports = {
  add,
  find,
  update,
  remove
};

function errorMsg(error, msg, rtn = null) {
  console.error(msg, { message: error.message, error });
  return rtn;
}
/*
function dynamicUpdate(table, change, where) {
  let base = ["UPDATE ", table, " SET"];
  let set = Object.keys(change).map((key, index, arr) => {
    return ` ${key} = $${index + 1}${index === arr.length - 1 ? "," : ""}`;
  });
  let where = Object.keys(where).map((key, index, arr) => {
    return ` ${key} = $${index + 1 + Object.keys(change).length} ${
      index === arr.length - 1 ? "AND " : ""
    }`;
  });

  const query = [...base, ...set, " WHERE", ...where].join("");
  console.log("update query", query);
  return query;
}
*/
async function add(pg, plant) {
  const { common_name, commonName, scientific_name, scientificName } = plant;
  try {
    const { rows } = await pg.query(
      `
        INSERT INTO public.plants (common_name, scientific_name)
        VALUES ($1, $2)
        RETURNING *
    `,
      [common_name || commonName, scientific_name || scientificName]
    );
    return rows[0];
  } catch (error) {
    return errorMsg(error, "Failed to add that plant");
  }
}

async function find(pg, id) {
  //how can I pass in object to get something thing like:
  /*
    Select * where $1 = $2
    or
    Select * where $1 = ANY($2)
    */
  try {
    const { rows } = await pg.query(
      `
            SELECT * 
            FROM public.plants
            WHERE id = $1
        `,
      [id]
    );
    return rows[0];
  } catch (error) {
    return errorMsg(error, `Failed to find plant with id: ${id}`);
  }
}

async function update(pg, change) {
  try {
    const { rows } = await pg.query(
      `
    UPDATE public.plants
    SET common_name = $1, scientific_name = $2
    WHERE id = $3
    RETURNING *
    `,
      [
        change.common_name || change.commonName,
        change.scientific_name || change.scientificName,
        change.id
      ]
    );
    return rows[0];
  } catch (error) {
    return errorMsg(error, "Failed to update plant");
  }
}
async function remove(pg, id) {
  try {
    const { rows } = await pg.query(
      `
        DELETE FROM public.plants
        WHERE id = $1
        RETURNING *
        `,
      [id]
    );
    return rows[0];
  } catch (error) {
    return errorMsg(error, "Failed to delete");
  }
}

if (require.main === module) {
  const pool = require("../../utils/pool");
  const getStuff = async () => {
    const client = await pool.connect();
    try {
      const data = await find(client, { id: 1 });
      console.log({ data });
    } catch (error) {
      errorMsg(error, "didn work");
    } finally {
      client.release();
    }
  };
  getStuff().then(() => process.exit(1));
}