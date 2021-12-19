const pg = require("../../utils/pool");
async function cleanup() {
  const client = await pg.connect();
  await client.query(
    "truncate plants, inventory_statuses restart identity cascade"
  );
  console.log("Cleaned up test db");
  await client.release();
  console.log("Final client release");
  await pg.end();
  return console.log("Pool ended");
}

module.exports = async () => await cleanup();
