const pg = require("./pool");

async function cleanup() {
  const client = await pg.connect();
  await client.query("truncate plants restart identity cascade");
  await client.release();
  await pg.end();
  return console.log("Cleaned up test db");
}

if (require.main === module) {
  console.log("cleaning up using main", process.env.NODE_ENV);
  cleanup();
  return;
}
