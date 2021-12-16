const pg = require("../../utils/pool");
const model = require("./statuses_model");

describe("statuses tests", () => {
  let client;
  beforeAll(async () => (client = await pg.connect()));

  afterAll(async () => {
    await client.release();
    await client.end();
  });

  it("should create a status", async () => {
    const status = await model.add(client, "test");
    expect(status.status).toBe("test");
  });
});
