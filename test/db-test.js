const test = require('ava')
const uuid = require('uuid-base62')
const r = require('rethinkdb')
const Db = require('../')
const fixtures = require('./fixtures/')

const dbName = `Shabbat_${uuid.v4()}`
const db = new Db({db: dbName})

// ----------------- Test´s Hook´s---------------- //

test.before('connect db', async t => {
  await db.connect()
  t.true(db.connected, 'Should by connected')
})

test.after('Drop a database', async t => {
  await db.disconnect()
  t.false(db.connected)
})

test.after.always('Disconnect from database', async t => {
  let conn = await db.connect({})
  await r.dbDrop(dbName).run(conn)
})

// --------------------- Test´s -------------------- //

// SaveCustomer Method Test
test('saveCustomer test', async t => {
  let customer = fixtures.getCustomer()
  t.is(typeof db.saveCustomer, 'function', 'should by a function')

  let created = await db.saveCustomer(customer)
  t.is(created.name, customer.name)
  t.is(created.email, customer.email)
  t.is(created.phone, customer.phone)
  t.is(typeof created.id, 'string')
  t.truthy(created.public_id)
  t.is(created.public_id, uuid.encode(created.id))
  t.truthy(created.createdAt)
  t.deepEqual(created.payment_sources, customer.payment_sources)
})

// getCustomer Method Test
test('getCustomer test', async t => {
  let customer = fixtures.getCustomer()
  t.is(typeof db.getCustomer, 'function', 'Should by a function')

  let created = await db.saveCustomer(customer)
  let result = await db.getCustomer(created.public_id)

  t.truthy(created.public_id)
  t.deepEqual(result, created)
})
