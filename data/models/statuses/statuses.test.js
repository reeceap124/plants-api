const pg = require('../../../utils/pool')
const model = require('./statuses_model')

describe('statuses tests', () => {
  let client
  beforeAll(async () => (client = await pg.connect()))

  afterAll(async () => {
    await client.release()
    await pg.end()
  })

  it('should create a status', async () => {
    const newStatus = await model.add(client, 'test')
    expect(newStatus.status).toBe('test')
  })

  it('should find a status by id', async () => {
    const created = await model.add(client, 'test2')
    const found = await model.find(client, created.id)
  })

  it('should find all statuses', async () => {
    const all = await model.findAll(client)
    expect(all.length).toBeGreaterThanOrEqual(6)
  })
})
