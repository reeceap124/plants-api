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
    select id from plants where common_name = 'snake plant'`);
    statuses = await pg.query(
      `select * from inventory_statuses where status = 'active'`
    );
  });
  afterAll(async () => {
    await client.release();
    await pg.end();
  });

  it("should add a parent inventory item and child", async () => {
    const newItem = await model.add(client, {
      plants_key: plant.rows[0].id,
      status_key: statuses.rows[0].id,
      cost: 100
    });
    expect(newItem.common_name).toBe("snake plant");
    expect(newItem.status).toBe("active");
    expect(newItem.cost).toBe(100);
    const secondNew = await model.add(
      client,
      {
        plants_key: newItem.plants_key,
        status_key: newItem.status_key,
        cost: 0
      },
      newItem.id
    );
    expect(secondNew.common_name).toBe("snake plant");
    expect(secondNew.ancestry).toBe(`${newItem.ancestry}.${secondNew.id}`);
    expect(secondNew.cost).toBe(0);
  });

  it("Should update inventory ", () => {
    expect(true).toBe(true);
  });
});
