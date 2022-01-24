const { it, beforeAll, afterAll } = require('@jest/globals')
const pg = require('../../../utils/pool')
const model = require('./inventory_model')

describe('inventory tests', () => {
  let client
  let plant
  let statuses
  beforeAll(async () => {
    client = await pg.connect()
    plant = await pg.query(`
    select id from plants where common_name = 'snake plant'`)
    statuses = await pg.query(
      `select * from inventory_statuses where status = 'for sale'`
    )
  })
  afterAll(async () => {
    await client.release()
    await pg.end()
  })

  it('should find all plants for a user', async () => {
    const shouldBe = await client.query(
      `SELECT count(*)::integer FROM inventory WHERE users_key = 1`
    )
    const plants = await model.findUsersPlants(client, 1)
    expect(plants.length).toBe(shouldBe.rows[0].count)
  })

  it('should add a parent inventory item and child', async () => {
    const newItem = await model.add(client, {
      plants_key: plant.rows[0].id,
      status_key: statuses.rows[0].id,
      cost: 100
    })
    expect(newItem.common_name).toBe('snake plant')
    expect(newItem.status).toBe('for sale')
    expect(newItem.cost).toBe(100)
    const secondNew = await model.add(
      client,
      {
        plants_key: newItem.plants_key,
        status_key: newItem.status_key,
        cost: 0
      },
      newItem.id
    )
    expect(secondNew.common_name).toBe('snake plant')
    expect(secondNew.ancestry).toBe(`${newItem.ancestry}.${secondNew.id}`)
    expect(secondNew.cost).toBe(0)
  })

  it('Should update inventory ', async () => {
    // update a specific inventory item.
    // update inventory with a specific ancestry.
    // update
    const motherItem1 = await model.add(client, {
      plants_key: plant.rows[0].id,
      status_key: statuses.rows[0].id,
      cost: 100
    })
    const motherItem2 = await model.add(
      client,
      {
        plants_key: plant.rows[0].id,
        status_key: statuses.rows[0].id,
        cost: 75
      },
      motherItem1.id
    )

    const childItem = await model.add(
      client,
      {
        plants_key: motherItem1.plants_key,
        status_key: motherItem1.status_key,
        cost: 50
      },
      motherItem2.id
    )

    expect(childItem.ancestry).toBe(
      `${motherItem1.id}.${motherItem2.id}.${childItem.id}`
    )
    const updatedChild = await model.update(
      client,
      { cost: 0 },
      { id: childItem.id }
    )
    expect(updatedChild[0].id).toBe(childItem.id)
    expect(updatedChild[0].cost).toBe(0)
  })
})
