const pg = require("../../utils/pool");
async function cleanup() {
  const client = await pg.connect();
  await client.query(
    "truncate plants, inventory_statuses restart identity cascade"
  );
  await client.release();
  await pg.end();
  return console.log("Cleaned up test db");
}

module.exports = async () => await cleanup();
