const { it, beforeAll, afterAll } = require("@jest/globals");
const pg = require("../../../utils/pool");
const model = require("./inventory_model");

describe("inventory tests", () => {
  let client;
  let plant;
  let statuses;
  beforeAll(async () => {
    client = await pg.connect();
    plant = await pg.query(`
    select id from plants where common_name = 'snake_plant'`);
    statuses = await pg.query(
      `select * from inventory_statuses where status = 'active'`
    );
  });
  afterAll(async () => {
    await client.release();
    await pg.end();
  });

  it("should add an inventory item", async () => {
    const newItem = await model.add(client, {
      plants_key: plant.rows[0].id,
      statuses_key: statuses.rows[0].id,
      cost: 100
    });
  });
});
