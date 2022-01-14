const pg = require('../../../utils/pool')
const model = require('./users_model')

describe('users tests', () => {
  let client
  beforeAll(async () => {
    client = await pg.connect()
  })
  afterAll(async () => {
    await client.release()
    await pg.end()
  })

  it('should add a user', async () => {
    const newUser = await model.add(client, {
      email: 'test',
      password: 'testpass'
    })
    expect(newUser.email).toBe('test')
  })

  it('should find users', async () => {
    const testUser = await model.add(client, {
      email: 'test2',
      password: 'testpass'
    })
    const user = await model.find(client, testUser.id)

    expect(testUser.id).toBe(user[0].id)
  })
})
