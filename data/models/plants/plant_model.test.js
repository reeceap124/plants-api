const model = require('./plant_model')
const pg = require('../../../utils/pool')

describe('Functions for plant table', () => {
  let client
  beforeAll(async () => {
    client = await pg.connect()
  })
  afterAll(async () => {
    await client.release()
    await pg.end()
  })
  it('Should add a plant', async function () {
    const initialData = await client.query(
      `SELECT count(*)::integer from plants`
    )
    const initialCount = initialData.rows[0].count
    const newPlant = await model.add(client, {
      commonName: 'test common',
      scientificName: 'test scientific'
    })
    expect(newPlant.common_name).toBe('test common')
    expect(newPlant.scientific_name).toBe('test scientific')
    const followUp = await client.query(`SELECT count(*)::integer from plants`)
    const addedCount = followUp.rows[0].count
    expect(addedCount).toBe(initialCount + 1)
  })

  it('should find plant by id', async () => {
    const toFind = await model.add(client, {
      common_name: '2test common2',
      scientific_name: '2test scientific2'
    })
    const found = await model.find(client, toFind.id)
    expect(found.id).toBe(toFind.id)
    expect(found.common_name).toBe('2test common2')
  })

  it('should find all plants for user with id of 1', async () => {
    const plants = await model.findAll(client, 1)
    expect(plants.length).toBeGreaterThanOrEqual(1)
  })

  it('should update a plant', async () => {
    const toUpdate = await model.add(client, {
      common_name: 'to update',
      scientific_name: 'to update scientifically'
    })
    const update = { ...toUpdate, common_name: 'updated common' }
    const updated = await model.update(client, update)
    expect(updated.id).toBe(toUpdate.id)
    expect(updated.common_name).toBe('updated common')
  })

  it('should remove plants', async () => {
    const toDelete = await model.add(client, {
      common_name: 'to be removed',
      scientific_name: 'to be removed scientifically'
    })
    await model.remove(client, toDelete.id)
    const deleted = await model.find(client, toDelete.id)
    expect(deleted).toBe(null)
  })
})
